export type ResponseRawEntry = { key: string; value: string };
export type ResponseRawEntries = ResponseRawEntry[][];

export function formatResponse(response: unknown): string {
  if (typeof response === 'string') {
    return response;
  }

  if (response && typeof response === 'object' && 'message' in response) {
    const message = (response as { message?: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  const data = (response as { data?: unknown })?.data;
  if (Array.isArray(data) && typeof data[0] === 'string') {
    return data[0];
  }

  return 'Resposta sem dados de texto.';
}

export function normalizeRawEntries(raw: unknown): ResponseRawEntries {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      return Object.entries(entry as Record<string, unknown>)
        .filter(([key]) => !isFilteredKey(key))
        .map(([key, value]) => {
          const normalized = normalizeKey(key);
          if (normalized === 'doneat') {
            return {
              key: 'Feito em',
              value: formatDateTime(value),
            };
          }

          if (normalized === 'workoutname') {
            return {
              key: 'Nome do treino',
              value: stringifyValue(value),
            };
          }

          if (normalized === 'exercises') {
            return {
              key: 'Exercicios',
              value: formatExercises(value),
            };
          }

          return {
            key: humanizeKey(key),
            value: stringifyValue(value),
          };
        });
    })
    .filter((entry): entry is ResponseRawEntry[] => entry !== null);
}

function humanizeKey(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifyValue(item)).join(', ');
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function isFilteredKey(key: string): boolean {
  const normalized = normalizeKey(key);
  return normalized === 'id' || normalized === 'userid' || normalized === 'workoutid';
}

function normalizeKey(key: string): string {
  return key.replace(/[_\s-]/g, '').toLowerCase();
}

function formatDateTime(value: unknown): string {
  if (!value) {
    return '-';
  }

  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return stringifyValue(value);
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatExercises(value: unknown): string {
  if (!Array.isArray(value)) {
    return stringifyValue(value);
  }

  const lines = value
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return stringifyValue(item);
      }

      const exercise = item as {
        name?: unknown;
        sets?: unknown;
        reps?: unknown;
        weightKg?: unknown;
      };
      const name = typeof exercise.name === 'string' ? exercise.name : 'Exercicio';
      const sets = exercise.sets !== undefined ? stringifyValue(exercise.sets) : '-';
      const reps = exercise.reps !== undefined ? stringifyValue(exercise.reps) : '-';
      const weight = exercise.weightKg !== undefined ? stringifyValue(exercise.weightKg) : '-';

      return `${name} • ${sets}x${reps} • ${weight}kg`;
    })
    .filter(Boolean);

  return lines.length ? lines.join('\n') : '-';
}

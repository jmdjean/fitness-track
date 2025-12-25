import {
  customError,
  email,
  minLength,
  required,
  validate,
  type SchemaPath,
  type SchemaPathTree,
} from '@angular/forms/signals';

export type BodyMetrics = {
  weightKg: number | null;
  heightCm: number | null;
};

export type PasswordConfirmation = {
  password: string;
  confirmPassword: string;
};

export const applyRequiredEmail = (path: SchemaPath<string>): void => {
  required(path);
  email(path);
};

export const applyRequiredPassword = (path: SchemaPath<string>, min = 6): void => {
  required(path);
  minLength(path, min);
};

export const applyRequiredDate = (path: SchemaPath<Date | null>): void => {
  required(path);
};

export const applyBodyMetricsValidation = (
  path: SchemaPath<BodyMetrics>,
  options: {
    minWeight?: number;
    maxWeight?: number;
    minHeight?: number;
    maxHeight?: number;
  } = {},
): void => {
  const {
    minWeight = 30,
    maxWeight = 300,
    minHeight = 100,
    maxHeight = 230,
  } = options;

  validate(path, ({ value }) => {
    const metrics = value();
    const errors = [];

    if (metrics.weightKg === null || Number.isNaN(metrics.weightKg)) {
      errors.push(customError({ kind: 'weightRequired', message: 'Weight is required' }));
    } else {
      if (metrics.weightKg < minWeight) {
        errors.push(
          customError({ kind: 'weightMin', message: `Min weight is ${minWeight} kg` }),
        );
      }
      if (metrics.weightKg > maxWeight) {
        errors.push(
          customError({ kind: 'weightMax', message: `Max weight is ${maxWeight} kg` }),
        );
      }
    }

    if (metrics.heightCm === null || Number.isNaN(metrics.heightCm)) {
      errors.push(customError({ kind: 'heightRequired', message: 'Height is required' }));
    } else {
      if (metrics.heightCm < minHeight) {
        errors.push(
          customError({ kind: 'heightMin', message: `Min height is ${minHeight} cm` }),
        );
      }
      if (metrics.heightCm > maxHeight) {
        errors.push(
          customError({ kind: 'heightMax', message: `Max height is ${maxHeight} cm` }),
        );
      }
    }

    return errors.length ? errors : null;
  });
};

export const applyPasswordConfirmation = (
  path: SchemaPathTree<PasswordConfirmation>,
  message = 'Senhas nao conferem',
): void => {
  validate(path, ({ value, fieldTreeOf }) => {
    const { password, confirmPassword } = value();
    if (!password || !confirmPassword) {
      return null;
    }

    if (password === confirmPassword) {
      return null;
    }

    return customError({
      kind: 'passwordMismatch',
      message,
      fieldTree: fieldTreeOf(path.confirmPassword),
    });
  });
};

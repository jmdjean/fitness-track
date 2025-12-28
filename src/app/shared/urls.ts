export const API_URLS = {
  question: '/question',
  trainings: '/trainings',
  workouts: '/workouts',
  workoutById: (id: string) => `/workouts/${id}`,
  exercises: '/exercises',
  authRegister: '/auth/register',
  authLogin: '/auth/login',
} as const;

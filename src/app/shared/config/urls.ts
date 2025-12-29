export const API_URLS = {
  question: '/question',
  trainings: '/trainings',
  workouts: '/workouts',
  workoutById: (id: string) => `/workouts/${id}`,
  workoutDones: '/workout/dones',
  workoutDonesQuestion: '/workout/dones/question',
  exercises: '/exercises',
  authRegister: '/auth/register',
  authLogin: '/auth/login',
} as const;

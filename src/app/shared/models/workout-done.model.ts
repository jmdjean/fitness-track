export type WorkoutDoneExercise = {
  exerciseId: string;
  sets: number;
  reps: number;
  weightKg: number;
};

export type WorkoutDone = {
  id: string;
  workout: {
    id: string;
    name: string;
  };
  exercises: WorkoutDoneExercise[];
  createdAt?: string;
};

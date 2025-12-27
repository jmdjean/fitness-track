
export type IWorkoutExercises = {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
};

export type IWorkout = {
  id: string;
  name: string;
  exercises: IWorkoutExercises[];
  totalCalories: number;
};

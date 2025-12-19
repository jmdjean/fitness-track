import { ExerciseName } from '../enums/exercise-name.enum';

export interface TypeOfExercises {
  id: string;
  name: ExerciseName;
  caloriesPerUnit: number;
}

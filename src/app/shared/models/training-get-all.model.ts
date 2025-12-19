import { TrainingStatus } from '../enums/training-status.enum';
import { TypeOfExercises } from './type-of-exercises.model';

export interface TrainingGetAll {
  id: string;
  exerciseDate: Date;
  timeCompleted: number;
  status: TrainingStatus;
  exercises: TypeOfExercises[];
  quantidadeExercicios: number;
}

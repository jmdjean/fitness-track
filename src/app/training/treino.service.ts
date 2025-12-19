import { Injectable } from '@angular/core';
import { MOCK_DONE_TRAININGS } from '../shared/mocks/mock-done-trainings';
import { TrainingGetAll } from '../shared/models/training-get-all.model';

@Injectable({
  providedIn: 'root',
})
export class TreinoService {
  getAll(): TrainingGetAll[] {
    return MOCK_DONE_TRAININGS;
  }
}

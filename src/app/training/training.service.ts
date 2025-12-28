import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { API_URLS } from '../shared/urls';
import { MOCK_DONE_TRAININGS } from '../shared/mocks/mock-done-trainings';
import { TrainingGetAll } from '../shared/models/training-get-all.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<TrainingGetAll[]> {
    if (environment.useMocks) {
      return of(MOCK_DONE_TRAININGS);
    }

    return this.http.get<TrainingGetAll[]>(
      `${environment.apiBaseUrl}${API_URLS.trainings}`
    );
  }
}


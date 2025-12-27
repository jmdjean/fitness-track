import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { MOCK_WORKOUTS } from '../shared/mocks/mock-workouts';
import { IWorkout } from '../shared/models/workout-exercises.model';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IWorkout[]> {
    if (environment.useMocks) {
      return of(MOCK_WORKOUTS);
    }

    return this.http.get<IWorkout[]>(`${environment.apiBaseUrl}/workouts`);
  }
}

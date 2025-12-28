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

  create(payload: WorkoutCreatePayload): Observable<unknown> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    return this.http.post<unknown>(`${environment.apiBaseUrl}/workouts`, payload);
  }

  delete(id: string): Observable<unknown> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    return this.http.delete<unknown>(`${environment.apiBaseUrl}/workouts/${id}`);
  }
}

export type WorkoutCreatePayload = {
  name: string;
  exercises: Array<{
    exercise: string;
    sets: number;
    reps: number;
  }>;
};

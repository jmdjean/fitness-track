import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { API_URLS } from '../shared/config/urls';
import { MOCK_WORKOUTS } from '../shared/mocks/mock-workouts';
import { type WorkoutDone } from '../shared/models/workout-done.model';
import { IWorkout } from '../shared/models/workout-exercises.model';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getAll(): Observable<IWorkout[]> {
    if (environment.useMocks) {
      return of(MOCK_WORKOUTS);
    }

    return this.http.get<IWorkout[]>(`${environment.apiBaseUrl}${API_URLS.workouts}`);
  }

  getAllByName(name: string): Observable<IWorkout[]> {
    return this.getAll().pipe(
      map((workouts) => {
        const term = name.trim().toLowerCase();
        if (!term) {
          return workouts;
        }

        return workouts.filter((workout) =>
          (workout.name ?? '').toLowerCase().includes(term)
        );
      })
    );
  }

  getDones(): Observable<WorkoutDone[]> {
    if (environment.useMocks) {
      return of([]);
    }

    return this.http.get<WorkoutDone[]>(
      `${environment.apiBaseUrl}${API_URLS.workoutDones}`
    );
  }

  getLastWeekCount(): Observable<WorkoutLastWeekCountResponse> {
    if (environment.useMocks) {
      return of({ count: 0, startDate: '', endDate: '' });
    }

    return this.http.get<WorkoutLastWeekCountResponse>(
      `${environment.apiBaseUrl}${API_URLS.workoutDonesLastWeekCount}`
    );
  }

  getLastWeekCalories(): Observable<WorkoutLastWeekCaloriesResponse> {
    if (environment.useMocks) {
      return of({ totalCalories: 0, startDate: '', endDate: '' });
    }

    return this.http.get<WorkoutLastWeekCaloriesResponse>(
      `${environment.apiBaseUrl}${API_URLS.workoutDonesLastWeekCalories}`
    );
  }

  getLastWeekMaxWeightExercise(): Observable<WorkoutLastWeekMaxWeightResponse> {
    if (environment.useMocks) {
      return of({ exerciseName: '', maxWeightKg: 0, startDate: '', endDate: '' });
    }

    return this.http.get<WorkoutLastWeekMaxWeightResponse>(
      `${environment.apiBaseUrl}${API_URLS.workoutDonesLastWeekMaxWeight}`
    );
  }

  askDonesQuestion(payload: { question: string }): Observable<{ data?: string[]; raw?: unknown[] }> {
    if (environment.useMocks) {
      return of({ data: [], raw: [] });
    }

    return this.http.post<{ data?: string[]; raw?: unknown[] }>(
      `${environment.apiBaseUrl}${API_URLS.workoutDonesQuestion}`,
      payload
    );
  }

  create(payload: WorkoutCreatePayload): Observable<unknown> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    const userId = this.getUserIdentifier();
    const payloadWithUser = userId ? { ...payload, userId } : payload;

    return this.http.post<unknown>(
      `${environment.apiBaseUrl}${API_URLS.workouts}`,
      payloadWithUser
    );
  }

  createDone(payload: WorkoutDoneCreatePayload): Observable<unknown> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    return this.http.post<unknown>(
      `${environment.apiBaseUrl}${API_URLS.workoutDones}`,
      payload
    );
  }

  delete(id: string): Observable<unknown> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    return this.http.delete<unknown>(`${environment.apiBaseUrl}${API_URLS.workoutById(id)}`);
  }

  private getUserIdentifier(): string | null {
    const session = this.authService.getSession();
    const user = session?.user;
    if (!user) {
      return null;
    }

    if (typeof user === 'string') {
      return user;
    }

    if (user.id !== undefined && user.id !== null) {
      return String(user.id);
    }

    if (user.email) {
      return user.email;
    }

    return null;
  }
}

export type WorkoutCreatePayload = {
  name: string;
  exercises: Array<{
    exercise: string;
    sets: number;
    reps: number;
  }>;
  quantityCalories: number;
  userId?: string;
};

export type WorkoutDoneCreatePayload = {
  workoutId: string;
  exercises: Array<{
    exerciseId: string;
    sets: number;
    reps: number;
    weightKg: number;
  }>;
};

export type WorkoutLastWeekCountResponse = {
  count: number;
  startDate: string;
  endDate: string;
};

export type WorkoutLastWeekCaloriesResponse = {
  totalCalories: number;
  startDate: string;
  endDate: string;
};

export type WorkoutLastWeekMaxWeightResponse = {
  exerciseName: string;
  maxWeightKg: number;
  startDate: string;
  endDate: string;
};

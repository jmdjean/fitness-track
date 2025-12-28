import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { API_URLS } from '../shared/config/urls';
import { MOCK_WORKOUTS } from '../shared/mocks/mock-workouts';
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
  userId?: string;
};

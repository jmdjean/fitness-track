import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { type BodyMetrics } from '../shared/signal-forms/validators';

export type RegisterPayload = {
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: Date | null;
  bodyMetrics: BodyMetrics;
};

export type LoginPayload = {
  email: string;
  password: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<unknown> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    return this.http.post<unknown>(
      `${environment.apiBaseUrl}/auth/register`,
      payload
    );
  }

  login(payload: LoginPayload): Observable<unknown> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    return this.http.post<unknown>(
      `${environment.apiBaseUrl}/auth/login`,
      payload
    );
  }
}

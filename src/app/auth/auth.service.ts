import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { API_URLS } from '../shared/urls';
import { type BodyMetrics } from '../shared/signal-forms/validators';
import { type AuthResponse, type AuthSession, type AuthUser } from './auth.types';

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
  private readonly storageKey = 'fitness-track-auth';
  private readonly sessionSubject = new BehaviorSubject<AuthSession | null>(
    this.loadSession()
  );

  readonly session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(payload: RegisterPayload): Observable<unknown> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    return this.http.post<unknown>(
      `${environment.apiBaseUrl}${API_URLS.authRegister}`,
      payload
    );
  }

  login(payload: LoginPayload): Observable<unknown> {
    if (environment.useMocks) {
      const session: AuthSession = {
        token: null,
        user: { email: payload.email },
      };
      this.saveSession(session);
      return of({ ok: true });
    }

    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}${API_URLS.authLogin}`, payload)
      .pipe(
        tap((response) => {
          const session = this.buildSession(response, payload.email);
          if (session) {
            this.saveSession(session);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.sessionSubject.next(null);
  }

  getSession(): AuthSession | null {
    return this.sessionSubject.value;
  }

  private buildSession(response: AuthResponse, fallbackEmail: string): AuthSession | null {
    if (!response) {
      return null;
    }

    const token = response.token ?? response.accessToken ?? null;
    const user: AuthUser | string | null =
      response.user ?? response.email ?? fallbackEmail ?? null;

    return { token, user };
  }

  private saveSession(session: AuthSession): void {
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  private loadSession(): AuthSession | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  }
}


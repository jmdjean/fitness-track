import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { API_URLS } from '../shared/config/urls';

export type DietResponse = Record<string, unknown> | null;

@Injectable({
  providedIn: 'root',
})
export class DietService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getLatest(): Observable<DietResponse> {
    if (environment.useMocks) {
      return of(null);
    }

    return this.http.get<DietResponse>(
      `${environment.apiBaseUrl}${API_URLS.dietLatest}`,
      { headers: this.buildHeaders() }
    );
  }

  generate(): Observable<DietResponse> {
    if (environment.useMocks) {
      return of(null);
    }

    return this.http.post<DietResponse>(
      `${environment.apiBaseUrl}${API_URLS.dietGenerate}`,
      {},
      { headers: this.buildHeaders() }
    );
  }

  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const userId = this.getUserIdentifier();
    if (userId) {
      headers = headers.set('X-User', userId);
    }
    return headers;
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

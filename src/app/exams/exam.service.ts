import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { API_URLS } from '../shared/config/urls';

export type ExamUploadResponse = Record<string, unknown> | null;
export type ExamByUserResponse = Record<string, unknown> | null;

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  uploadExam(file: File): Observable<ExamUploadResponse> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    const formData = new FormData();
    formData.append('file', file);
    const userId = this.getUserIdentifier();
    if (userId) {
      formData.append('userId', userId);
    }

    return this.http.post<ExamUploadResponse>(
      `${environment.apiBaseUrl}${API_URLS.examsImport}`,
      formData,
      { headers: this.buildHeaders() }
    );
  }

  getByUser(): Observable<ExamByUserResponse> {
    if (environment.useMocks) {
      return of(null);
    }

    const userId = this.getUserIdentifier();
    if (!userId) {
      return of(null);
    }

    return this.http.get<ExamByUserResponse>(
      `${environment.apiBaseUrl}${API_URLS.examsByUser(userId)}`,
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

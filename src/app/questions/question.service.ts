import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { API_URLS } from '../shared/config/urls';

export type QuestionPayload = {
  question: string;
};

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  create(payload: QuestionPayload): Observable<unknown> {
    if (environment.useMocks) {
      return of({ ok: true });
    }

    if (!environment.apiBaseUrl) {
      return throwError(() => ({
        error: 'apiBaseUrl não configurado.',
      }));
    }

    return this.http.post<unknown>(
      `${environment.apiBaseUrl}${API_URLS.question}`,
      payload
    );
  }
}


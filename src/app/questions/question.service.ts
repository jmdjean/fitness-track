import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

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

    return this.http.post<unknown>(`${environment.apiBaseUrl}/questions`, payload);
  }
}

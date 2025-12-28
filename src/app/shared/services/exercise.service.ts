import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_URLS } from '../urls';
import { MOCK_EXERCISES } from '../mocks/mock-exercises';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<string[]> {
    if (environment.useMocks) {
      return of(MOCK_EXERCISES);
    }

    return this.http.get<string[]>(`${environment.apiBaseUrl}${API_URLS.exercises}`);
  }
}


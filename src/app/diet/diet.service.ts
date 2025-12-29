import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { API_URLS } from '../shared/config/urls';

export type DietResponse = Record<string, unknown> | null;

@Injectable({
  providedIn: 'root',
})
export class DietService {
  constructor(private http: HttpClient) {}

  getLatest(): Observable<DietResponse> {
    if (environment.useMocks) {
      return of(null);
    }

    return this.http.get<DietResponse>(
      `${environment.apiBaseUrl}${API_URLS.dietLatest}`
    );
  }

  generate(): Observable<DietResponse> {
    if (environment.useMocks) {
      return of(null);
    }

    return this.http.post<DietResponse>(
      `${environment.apiBaseUrl}${API_URLS.dietGenerate}`,
      {}
    );
  }
}

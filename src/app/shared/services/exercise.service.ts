import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { API_URLS } from '../config/urls';
import { MOCK_EXERCISES } from '../mocks/mock-exercises';
import { IIdNome } from '../models/id-nome.model';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IIdNome[]> {
    if (environment.useMocks) {
      return of(
        MOCK_EXERCISES.map((nome, index) => ({
          id: String(index + 1),
          nome,
        }))
      );
    }

    return this.http
      .get<unknown[]>(`${environment.apiBaseUrl}${API_URLS.exercises}`)
      .pipe(
        map((items) =>
          items.map((item, index) => {
            if (typeof item === 'string') {
              return { id: String(index + 1), nome: item };
            }

            if (item && typeof item === 'object') {
              const raw = item as Record<string, unknown>;
              const id =
                raw['id'] ?? raw['_id'] ?? raw['codigo'] ?? index + 1;
              const nome =
                raw['nome'] ??
                raw['name'] ??
                raw['descricao'] ??
                raw['title'] ??
                raw['id'] ??
                raw['_id'] ??
                '';

              return { id: String(id), nome: String(nome) };
            }

            return { id: String(index + 1), nome: String(index + 1) };
          })
        )
      );
  }
}

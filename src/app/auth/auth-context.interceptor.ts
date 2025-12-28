import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { type AuthSession } from './auth.types';

@Injectable()
export class AuthContextInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (environment.useMocks || !environment.apiBaseUrl) {
      return next.handle(req);
    }

    const session = this.authService.getSession();
    if (!session || !req.url.startsWith(environment.apiBaseUrl)) {
      return next.handle(req);
    }

    const headers = this.applyUserHeaders(req, session);
    return next.handle(req.clone({ headers }));
  }

  private applyUserHeaders(
    request: HttpRequest<unknown>,
    session: AuthSession
  ) {
    let headers = request.headers;

    if (session.token) {
      headers = headers.set('Authorization', `Bearer ${session.token}`);
    }

    const userIdentifier = this.getUserIdentifier(session);
    if (userIdentifier) {
      headers = headers.set('X-User', userIdentifier);
    } else if (headers.has('X-User')) {
      headers = headers.delete('X-User');
    }

    return headers;
  }

  private getUserIdentifier(session: AuthSession): string | null {
    const user = session.user;
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

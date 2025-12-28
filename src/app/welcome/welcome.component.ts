import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { type AuthSession } from '../auth/auth.types';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    standalone: false
})
export class WelcomeComponent {
  readonly userName$: Observable<string>;

  constructor(private authService: AuthService) {
    this.userName$ = this.authService.session$.pipe(
      map((session) => this.resolveUserName(session))
    );
  }

  private resolveUserName(session: AuthSession | null): string {
    const user = session?.user;
    if (!user) {
      return 'usuário';
    }

    if (typeof user === 'string') {
      return user;
    }

    return user.name ?? user.email ?? 'usuário';
  }
}

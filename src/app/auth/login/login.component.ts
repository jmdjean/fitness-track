import { Component, signal, type WritableSignal } from '@angular/core';
import { form, type FieldTree } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { NotificationHelperService } from '../../shared/services/notification-helper.service';
import { applyRequiredEmail, applyRequiredPassword } from '../../shared/signal-forms/validators';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent {
  readonly loginModel = this.createLoginModel();
  readonly loginForm = this.createLoginForm();

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
    private notificationHelper: NotificationHelperService
  ) {
  }

  hasError(field: FieldTree<unknown>, kind: string): boolean {
    return field().errors().some((error) => error.kind === kind);
  }

  shouldShowError(field: FieldTree<unknown>): boolean {
    const state = field();
    return state.touched() && state.invalid();
  }

  execLogin(): void {
    if (this.loginForm().invalid()) {
      this.markInvalidFields();
      return;
    }

    this.authenticate();
  }

  private markInvalidFields(): void {
    this.loginForm.email().markAsTouched();
    this.loginForm.password().markAsTouched();
  }

  private authenticate(): void {
    const { email, password } = this.loginModel();
    this.loadingService
      .track(this.authService.login({ email, password }))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (request) => {
          this.notificationHelper.showError(
            request?.error?.error ?? 'Erro ao realizar login.'
          );
        },
      });
  }

  private createLoginModel(): WritableSignal<LoginModel> {
    return signal({
      email: '',
      password: '',
    });
  }

  private createLoginForm(): FieldTree<LoginModel> {
    return form(this.loginModel, (login) => {
      applyRequiredEmail(login.email);
      applyRequiredPassword(login.password, 6);
    });
  }
}

type LoginModel = {
  email: string;
  password: string;
};

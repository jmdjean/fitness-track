import { Component, signal, type WritableSignal } from '@angular/core';
import { form, type FieldTree } from '@angular/forms/signals';
import { Router } from '@angular/router';
import {
  applyBodyMetricsValidation,
  applyPasswordConfirmation,
  applyRequiredDate,
  applyRequiredEmail,
  applyRequiredPassword,
  type BodyMetrics,
} from '../../shared/signal-forms/validators';
import { LoadingService } from '../../shared/services/loading.service';
import { NotificationHelperService } from '../../shared/services/notification-helper.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: false,
})
export class SignupComponent {
  readonly signupModel = this.createSignupModel();
  readonly signupForm = this.createSignupForm();

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private notificationHelper: NotificationHelperService
  ) {}

  hasError(field: FieldTree<unknown>, kind: string): boolean {
    return field().errors().some((error) => error.kind === kind);
  }

  shouldShowError(field: FieldTree<unknown>): boolean {
    const state = field();
    return state.touched() && state.invalid();
  }

  submit(): void {
    if (this.signupForm().invalid()) {
      this.markInvalidFields();
      return;
    }

    this.registerUser();
  }

  private createSignupModel(): WritableSignal<SignupModel> {
    return signal({
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: null as Date | null,
      bodyMetrics: {
        weightKg: null,
        heightCm: null,
      } as BodyMetrics,
    });
  }

  private createSignupForm(): FieldTree<SignupModel> {
    return form(this.signupModel, (signup) => {
      applyRequiredEmail(signup.email);
      applyRequiredPassword(signup.password, 6);
      applyRequiredPassword(signup.confirmPassword, 6);
      applyRequiredDate(signup.birthdate);
      applyBodyMetricsValidation(signup.bodyMetrics);
      applyPasswordConfirmation(signup);
    });
  }

  private markInvalidFields(): void {
    this.signupForm.email().markAsTouched();
    this.signupForm.password().markAsTouched();
    this.signupForm.confirmPassword().markAsTouched();
    this.signupForm.birthdate().markAsTouched();
    this.signupForm.bodyMetrics().markAsTouched();
  }

  private registerUser(): void {
    const { email, password, confirmPassword, birthdate, bodyMetrics } =
      this.signupModel();
    this.loadingService
      .track(
        this.authService.register({
          email,
          password,
          confirmPassword,
          birthdate,
          bodyMetrics,
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.notificationHelper.showError(
            error?.error ?? 'Erro ao cadastrar usuário.'
          );
        },
      });
  }
}

type SignupModel = {
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: Date | null;
  bodyMetrics: BodyMetrics;
};

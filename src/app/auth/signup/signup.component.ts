import { Component, signal } from '@angular/core';
import { form, type FieldTree } from '@angular/forms/signals';
import {
  applyBodyMetricsValidation,
  applyPasswordConfirmation,
  applyRequiredDate,
  applyRequiredEmail,
  applyRequiredPassword,
  type BodyMetrics,
} from '../../shared/signal-forms/validators';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    standalone: false
})
export class SignupComponent {
  readonly signupModel = signal({
    email: '',
    password: '',
    confirmPassword: '',
    birthdate: null as Date | null,
    bodyMetrics: {
      weightKg: null,
      heightCm: null,
    } as BodyMetrics,
  });

  readonly signupForm = form(this.signupModel, (signup) => {
    applyRequiredEmail(signup.email);
    applyRequiredPassword(signup.password, 6);
    applyRequiredPassword(signup.confirmPassword, 6);
    applyRequiredDate(signup.birthdate);
    applyBodyMetricsValidation(signup.bodyMetrics);
    applyPasswordConfirmation(signup);
  });

  hasError(field: FieldTree<unknown>, kind: string): boolean {
    return field().errors().some((error) => error.kind === kind);
  }

  shouldShowError(field: FieldTree<unknown>): boolean {
    const state = field();
    return state.touched() && state.invalid();
  }

  submit(): void {
    if (this.signupForm().invalid()) {
      this.signupForm.email().markAsTouched();
      this.signupForm.password().markAsTouched();
      this.signupForm.confirmPassword().markAsTouched();
      this.signupForm.birthdate().markAsTouched();
      this.signupForm.bodyMetrics().markAsTouched();
      return;
    }

    const { email, password, confirmPassword, birthdate, bodyMetrics } = this.signupModel();
    console.log('Signup payload', { email, password, confirmPassword, birthdate, bodyMetrics });
  }
}

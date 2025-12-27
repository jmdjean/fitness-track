import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {
    this.generateForm();
  }

  generateForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  execLogin(): void {
    if (this.loginForm.invalid) {
      this.markInvalidFields();
      return;
    }

    this.authenticate();
  }

  private markInvalidFields(): void {
    this.loginForm.markAllAsTouched();
  }

  private authenticate(): void {
    const { email, password } = this.loginForm.value;
    this.loadingService
      .track(this.authService.login({ email, password }))
      .subscribe(() => {
        this.router.navigate(['/finished-traning']);
      });
  }
}

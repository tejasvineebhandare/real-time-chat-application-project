import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent {
  readonly isRegister: boolean;
  readonly form = new FormBuilder().nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]]
  });
  busy = false;
  errorMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    route: ActivatedRoute
  ) {
    this.isRegister = route.snapshot.routeConfig?.path === 'register';
    if (this.isRegister) {
      this.form.controls.name.addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(40)]);
      this.form.controls.name.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid || this.busy) {
      this.form.markAllAsTouched();
      return;
    }

    this.busy = true;
    this.errorMessage = '';
    const { name, email, password } = this.form.getRawValue();
    const request = this.isRegister
      ? this.auth.register(name, email, password)
      : this.auth.login(email, password);

    request.subscribe({
      next: (response) => {
        this.auth.setSession(response);
        void this.router.navigate(['/chat']);
      },
      error: (error: unknown) => {
        this.busy = false;
        this.errorMessage = error instanceof HttpErrorResponse
          ? error.error?.message || 'We could not complete your request. Please try again.'
          : 'We could not complete your request. Please try again.';
      }
    });
  }
}

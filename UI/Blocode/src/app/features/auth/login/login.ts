import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  toastService = inject(ToastrService);

  loginFormGroup = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get emailFormControl() {
    return this.loginFormGroup.controls.email;
  }
  get passwordFormControl() {
    return this.loginFormGroup.controls.password;
  }

  onSubmit() {
    if (this.loginFormGroup.valid) {
      const rawValues = this.loginFormGroup.getRawValue();
      this.authService.login(rawValues.email, rawValues.password).subscribe({
        next: (response) => {
          this.toastService.success(`خوش اومدی ، ${response.email}`, '', {
            progressBar: true,
            timeOut: 3000,
          });
        },
        error: (err: HttpErrorResponse) => {
          const errorMessage = err.error.errors.message[0];
          this.toastService.error(`خطا : ${errorMessage}`, '', {
            progressBar: true,
            timeOut: 3000,
          });
        },
      });
    }
  }
}

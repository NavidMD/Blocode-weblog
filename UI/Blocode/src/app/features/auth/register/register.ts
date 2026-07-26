import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(AuthService);
  toastService = inject(ToastrService);
  router = inject(Router);

  registerFormGroup = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    repeatPassword: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get emailFormControl() {
    return this.registerFormGroup.controls.email;
  }
  get passwordFormControl() {
    return this.registerFormGroup.controls.password;
  }
  get repeatPasswordFormControl() {
    return this.registerFormGroup.controls.repeatPassword;
  }

  onSubmit() {
    if (this.registerFormGroup.valid) {
      const rawValues = this.registerFormGroup.getRawValue();
      this.authService.register(rawValues.email, rawValues.password).subscribe({
        next: (response) => {
          this.toastService.success(`ثبت نام با موفقیت انجام شد`, '', {
            progressBar: true,
            timeOut: 3000,
          });
          this.router.navigate(['/']);
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

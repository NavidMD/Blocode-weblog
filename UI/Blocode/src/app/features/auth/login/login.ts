import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);

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
    if(this.loginFormGroup.valid) {
      const rawValues = this.loginFormGroup.getRawValue();
      this.authService.login(rawValues.email, rawValues.password).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: () => {
          console.log('error');

        }
      })
    }
  }
}

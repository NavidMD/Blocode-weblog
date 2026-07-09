import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoggedUser, LoginResponseDTO } from '../models/auth.model';
import {
  HttpClient,
  httpResource,
  HttpResourceRef,
  HttpResourceRequest,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  toastService = inject(ToastrService);
  router = inject(Router);

  loggedUser: WritableSignal<LoggedUser | null> = signal(null);

  loadUser(): HttpResourceRef<LoggedUser | undefined> {
    return httpResource<LoggedUser>(() => {
      const request: HttpResourceRequest = {
        url: `${environment.apiBaseUrl}/api/auth/me`,
        withCredentials: true,
      };
      return request;
    });
  }
  login(email: string, password: string): Observable<LoginResponseDTO> {
    return this.http
      .post<LoginResponseDTO>(
        `${environment.apiBaseUrl}/api/auth/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(tap((user) => this.loggedUser.set(user)));
  }
  logout() {
    this.http
      .post<void>(
        `${environment.apiBaseUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: () => {
          this.loggedUser.set(null);
          this.toastService.success(`از حساب کاربری خارج شدید`, '', {
            progressBar: true,
            timeOut: 3000,
          });
          this.router.navigate(['/admin','login']);
        },
        error: () => {
          this.toastService.error(`خطا`, 'دوباره تلاش کنید', {
            progressBar: true,
            timeOut: 3000,
          });
        }
      });
  }
}

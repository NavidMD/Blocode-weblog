import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { LoggedUser, LoginResponseDTO, RegisterResponseDTO } from '../models/auth.model';
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

  private authPromise: Promise<void> | null = null;

  checkAuth(): Promise<void> {
    if (this.authPromise) {
      return this.authPromise;
    } else {
      this.authPromise = firstValueFrom(
        this.http.get<LoggedUser>(`${environment.apiBaseUrl}/api/auth/me`, {
          withCredentials: true,
        })
      )
      .then((user) => {
        this.loggedUser.set(user);
      })
      .catch(() => {
        this.loggedUser.set(null);
      })
      return this.authPromise;
    }
  }

  loadUser(): HttpResourceRef<LoggedUser | undefined> {
    return httpResource<LoggedUser>(() => {
      const request: HttpResourceRequest = {
        url: `${environment.apiBaseUrl}/api/auth/me`,
        withCredentials: true,
      };
      return request;
    });
  }

  register(email: string, password: string): Observable<RegisterResponseDTO> {
    return this.http
      .post<RegisterResponseDTO>(
        `${environment.apiBaseUrl}/api/auth/register`,
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
          this.router.navigate(['/admin', 'login']);
        },
        error: () => {
          this.toastService.error(`خطا`, 'دوباره تلاش کنید', {
            progressBar: true,
            timeOut: 3000,
          });
        },
      });
  }
}

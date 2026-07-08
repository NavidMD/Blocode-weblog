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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

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
}

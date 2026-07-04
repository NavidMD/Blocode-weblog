import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponseDTO } from '../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);

  login(email: string, password: string) : Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${environment.apiBaseUrl}/api/auth/login` , {
      email: email,
      password: password
    })
  }
}

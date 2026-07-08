import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./core/components/navbar/navbar";
import { Footer } from "./core/components/footer/footer";
import { ImageSelector } from "./shared/components/image-selector/image-selector";
import { AuthService } from './features/auth/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, ImageSelector],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Blocode');
  authService = inject(AuthService);

  loadUserRef = this.authService.loadUser();
  userValue = this.loadUserRef.value;

  loadUserEffect = effect(() => {
    const loadedUser = this.userValue();
    if(loadedUser) {
      this.authService.loggedUser.set(loadedUser);
    }
  })
  ngOnInit(): void {
    const isDark = localStorage.getItem('theme') === 'dark';
    if(isDark) {
      document.documentElement.classList.add('dark');
    }
    else {
      document.documentElement.classList.remove('light');
    }
  }
}

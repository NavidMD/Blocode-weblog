import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/components/navbar/navbar';
import { Footer } from './core/components/footer/footer';
import { ImageSelector } from './shared/components/image-selector/image-selector';
import { AuthService } from './features/auth/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, ImageSelector],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('Blocode');
  authService = inject(AuthService);

  // loadUserRef = this.authService.loadUser();
  // userValue = this.loadUserRef.value;

  // loadUserEffect = effect(() => {
  //   // وقتی دیگه در حال لود نیست (چه موفق چه ناموفق) یعنی درخواست تموم شده
  //   if (!this.loadUserRef.isLoading()) {
  //     const loadedUser = this.userValue();
  //     if (loadedUser) {
  //       this.authService.loggedUser.set(loadedUser);
  //     }
  //     this.authService.authChecked.set(true);
  //   }
  // });
  constructor() {
    this.authService.checkAuth();
  }
  ngOnInit(): void {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('light');
    }
  }
}

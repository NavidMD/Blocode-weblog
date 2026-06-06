import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./core/components/navbar/navbar";
import { Footer } from "./core/components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Blocode');
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

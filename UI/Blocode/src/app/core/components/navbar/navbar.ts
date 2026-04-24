import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryList } from '../../../features/category/category-list/category-list';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CategoryList],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private router: Router) {}

  optionChangeHandler(option: Event): void {
    const selectElement = option.target as HTMLSelectElement;

    let path = '';
    switch (selectElement.value) {
      case 'categories':
        path = 'categories';
        break;
      case 'blogs':
        path = 'blogs';
        break;
      case 'products':
        path = 'products';
        break;
      default:
        path = '';
    }
    if (path) {
      this.router.navigate(['admin', path]).catch(() => {
        this.router.navigate([''])
      });
    }
  }
}

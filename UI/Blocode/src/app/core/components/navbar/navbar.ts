import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryList } from '../../../features/category/category-list/category-list';

@Component({
  selector: 'app-navbar',
  imports: [CategoryList, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
}

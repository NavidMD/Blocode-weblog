import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddCategory } from '../add-category/add-category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [AddCategory, CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  addCategoryActive: boolean = false;
}

import { Component, inject, Signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddCategory } from '../add-category/add-category';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/category-service';
import { HttpResourceRef } from '@angular/common/http';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-category-list',
  imports: [AddCategory, CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  private categoryService = inject(CategoryService);
  private getAllCategoriesRef = this.categoryService.getAllCategories();

  isLoading: Signal<boolean> = this.getAllCategoriesRef.isLoading;
  isError: Signal<Error | undefined> = this.getAllCategoriesRef.error;
  value: WritableSignal<Category[] | undefined> = this.getAllCategoriesRef.value;

  addCategoryActive: boolean = false;
}

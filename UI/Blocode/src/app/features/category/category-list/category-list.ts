import { Component, effect, inject, Signal, WritableSignal } from '@angular/core';
import { AddCategory } from '../add-category/add-category';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/category-service';
import { Category } from '../models/category.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  imports: [AddCategory, CommonModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  private categoryService = inject(CategoryService);
  constructor(private router: Router) {
    effect(() => {
      if(this.categoryService.deleteCategoryStatusSignal() === 'success') {
        this.categoryService.deleteCategoryStatusSignal.set('idle');
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/',{ skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl)
        })
      }
      if(this.categoryService.deleteCategoryStatusSignal() === 'error') {
        console.log('something went wrong!');
      }
    })
  }
  //اینجا متد دریافت دسته بندی هارو از سرویس صدا زدیم
  private getAllCategoriesRef = this.categoryService.getAllCategories();


  isLoading: Signal<boolean> = this.getAllCategoriesRef.isLoading;
  isError: Signal<Error | undefined> = this.getAllCategoriesRef.error;
  value: Signal<Category[] | undefined> = this.getAllCategoriesRef.value;

  addCategoryActive: boolean = false;

  deleteCategory(id: string) {
    if(!id) {
      throw new Error('id is undefined');
    }
    else {
      this.categoryService.deleteCategory(id)
    }
  }
}

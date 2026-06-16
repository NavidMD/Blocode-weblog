import { Component, effect, inject, OnInit, Signal, WritableSignal } from '@angular/core';
import { AddCategory } from '../add-category/add-category';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../services/category-service';
import { Category } from '../models/category.model';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category-list',
  imports: [AddCategory, CommonModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  private categoryService = inject(CategoryService);
  toastService = inject(ToastrService);

  constructor(private router: Router) {
    effect(() => {
      if (this.categoryService.deleteCategoryStatusSignal() === 'success') {
        this.categoryService.deleteCategoryStatusSignal.set('idle');
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
        this.toastService.success('دسته بندی با موفقیت حذف شد', '', {
          progressBar: true,
          timeOut: 3000,
        });
      }
      if (this.categoryService.deleteCategoryStatusSignal() === 'error') {
        this.toastService.error('خطا در ارتباط با سرور', '', {
          progressBar: true,
          timeOut: 3000,
        });
      }
    });
  }
  //اینجا متد دریافت دسته بندی هارو از سرویس صدا زدیم
  private getAllCategoriesRef = this.categoryService.getAllCategories();

  isLoading: Signal<boolean> = this.getAllCategoriesRef.isLoading;
  isError: Signal<Error | undefined> = this.getAllCategoriesRef.error;
  value: Signal<Category[] | undefined> = this.getAllCategoriesRef.value;

  addCategoryActive: boolean = false;

  isPersian(char: string): boolean {
    return /[\u0600-\u06FF]/.test(char);
  }

  deleteCategory(id: string) {
    if (!id) {
      this.toastService.error('دسته بندی یافت نشد', '', {
        progressBar: true,
        timeOut: 3000,
      });
    } else {
      this.categoryService.deleteCategory(id);
    }
  }
}

import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, InputSignal, signal } from '@angular/core';

import {
  Category,
  NewCategoryRequestValues,
} from '../models/category.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private readonly baseUrl = environment.apiBaseUrl;

  addCategoryStatusSignal = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  //POST METHODS
  addCategory(newCategory: NewCategoryRequestValues) {
    this.addCategoryStatusSignal.set('loading');
    this.http.post<Category>(`${this.baseUrl}/api/categories`, newCategory).subscribe({
      next: (res) => {
        this.addCategoryStatusSignal.set('success');
        console.log(res);
      },
      error: () => {
        this.addCategoryStatusSignal.set('error');
      },
    });
  }

  //GET METHODS
  getAllCategories() {
    return httpResource<Category[]>(() => `${this.baseUrl}/api/categories`)
  }
  getCategoryById(categoryId: InputSignal<string | undefined>) {
    return httpResource<Category>(() => `${this.baseUrl}/api/categories/${categoryId()}`);
  }

  
}

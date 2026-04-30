import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, InputSignal, signal } from '@angular/core';

import {
  Category,
  NewCategoryRequestValuesDTO,
  UpdateCategoryRequestValuesDTO,
} from '../models/category.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private readonly baseUrl = environment.apiBaseUrl;

  addCategoryStatusSignal = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  updateCategoryStatusSignal = signal<'idle' | 'updating' | 'error' | 'success'>('idle');
  deleteCategoryStatusSignal = signal<'idle' | 'deleting' | 'error' | 'success'>('idle');

  //POST METHOD
  addCategory(newCategoryDTO: NewCategoryRequestValuesDTO) {
    this.addCategoryStatusSignal.set('loading');
    this.http.post<Category>(`${this.baseUrl}/api/categories`, newCategoryDTO).subscribe({
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
    return httpResource<Category[]>(() => `${this.baseUrl}/api/categories`);
  }
  getCategoryById(categoryId: InputSignal<string | undefined>) {
    return httpResource<Category>(() => `${this.baseUrl}/api/categories/${categoryId()}`);
  }

  //PUT METHOD
  updateCategory(id: string | undefined, newCategoryDTO: UpdateCategoryRequestValuesDTO) {
    if(!id) {
      throw new Error("id is undefined!")
    }
    this.updateCategoryStatusSignal.set('updating');
    this.http.put<Category>(`${this.baseUrl}/api/categories/${id}`, newCategoryDTO).subscribe({
      next: (res) => {
        this.updateCategoryStatusSignal.set('success');
        console.log(res);
      },
      error: () => {
        this.updateCategoryStatusSignal.set('error');
      },
    });
  }

  //DELETE METHOD
  deleteCategory(id: string) {
    this.deleteCategoryStatusSignal.set('deleting');
    this.http.delete<Category>(`${this.baseUrl}/api/categories/${id}`)
    .subscribe({
      next: (res) => {
        this.deleteCategoryStatusSignal.set('success')
        console.log('deleted successfully', res);
      },
      error: () => {
        this.deleteCategoryStatusSignal.set('error');
      }
    })
  }
}

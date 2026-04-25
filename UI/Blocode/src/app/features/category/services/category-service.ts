import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { NewCategoryRequestValues } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private readonly baseUrl: string = 'https://localhost:7143/';

  addCategoryStatusSignal = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  AddCategory(newCategory: NewCategoryRequestValues) {
    this.addCategoryStatusSignal.set('loading');
    this.http.post<void>(`${this.baseUrl}/api/categories`, newCategory).subscribe({
      next: () => {
        this.addCategoryStatusSignal.set('success');
      },
      error: () => {
        this.addCategoryStatusSignal.set('error');
      },
    });
  }
}

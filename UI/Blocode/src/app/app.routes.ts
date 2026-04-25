import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';
import { AddCategory } from './features/category/add-category/add-category';

export const routes: Routes = [
  {
    path: 'admin/categories',
    component: CategoryList,
  }
];

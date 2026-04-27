import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';
import { AddCategory } from './features/category/add-category/add-category';
import { App } from './app';
import { EditCategory } from './features/category/edit-category/edit-category';

export const routes: Routes = [
  {
    path: 'admin/categories/edit/:id',
    component: EditCategory,
  },
  {
    path: 'admin/categories',
    component: CategoryList,
  },
];

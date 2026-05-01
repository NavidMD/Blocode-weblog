import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';
import { EditCategory } from './features/category/edit-category/edit-category';
import { BlogpostList } from './features/blogpost/blogpost-list/blogpost-list';
import { AddBlogpost } from './features/blogpost/add-blogpost/add-blogpost';

export const routes: Routes = [
  {
    path: 'admin/categories/edit/:id',
    component: EditCategory,
  },
  {
    path: 'admin/blogs/add',
    component: AddBlogpost
  },
  {
    path: 'admin/categories',
    component: CategoryList,
  },
  {
    path: 'admin/blogs',
    component: BlogpostList,
  },
];

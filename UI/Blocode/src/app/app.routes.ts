import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';
import { EditCategory } from './features/category/edit-category/edit-category';
import { BlogpostList } from './features/blogpost/blogpost-list/blogpost-list';
import { AddBlogpost } from './features/blogpost/add-blogpost/add-blogpost';
import { EditBlogpost } from './features/blogpost/edit-blogpost/edit-blogpost';
import { Home } from './features/public/home/home';

export const routes: Routes = [
  {
    path: 'admin/blogs/edit/:id',
    component: EditBlogpost
  },
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
  {
    path: '',
    component: Home
  }
];

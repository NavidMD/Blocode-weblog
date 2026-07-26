import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';
import { EditCategory } from './features/category/edit-category/edit-category';
import { BlogpostList } from './features/blogpost/blogpost-list/blogpost-list';
import { AddBlogpost } from './features/blogpost/add-blogpost/add-blogpost';
import { EditBlogpost } from './features/blogpost/edit-blogpost/edit-blogpost';
import { Home } from './features/public/home/home';
import { BlogDetails } from './features/public/blog-details/blog-details';
import { Login } from './features/auth/login/login';
import { adminGuard } from './features/auth/guards/admin-guard';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
  {
    path: 'blogs/:url',
    component: BlogDetails
  },
  {
    path: 'blogs/byCategory/:categoryName',
    component: BlogpostList
  },
  {
    path: 'admin/blogs/edit/:id',
    component: EditBlogpost,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/categories/edit/:id',
    component: EditCategory,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/blogs/add',
    component: AddBlogpost,
    canActivate: [adminGuard]
  },
  {
    path: 'admin/categories',
    component: CategoryList,
    canActivate: [adminGuard]
  },
  {
    path: 'blogs',
    component: BlogpostList,
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: '',
    component: Home
  }
];

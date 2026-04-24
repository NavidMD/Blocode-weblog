import { Routes } from '@angular/router';
import { CategoryList } from './features/category/category-list/category-list';

export const routes: Routes = [
    {
        path: "admin/categories", component: CategoryList
    }
];

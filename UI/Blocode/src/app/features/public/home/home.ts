import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { BlogPostService } from '../../blogpost/services/blog-post-service';
import { BlogPost } from '../../blogpost/models/blogpost.model';
import { CategoryService } from '../../category/services/category-service';
import { Category } from '../../category/models/category.model';
import { Loader } from '../../../shared/components/loader/loader';
import { register } from 'swiper/element/bundle';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { PersianDatePipe } from '../../../shared/pipes/persian-date-pipe';
import { RouterLink } from '@angular/router';
import { LoaderMagazine } from '../../../shared/components/loader-magazine/loader-magazine';
import { LoadError } from '../../../shared/components/load-error/load-error';

register();

@Component({
  selector: 'app-home',
  imports: [
    Loader,
    ɵInternalFormsSharedModule,
    PersianDatePipe,
    RouterLink,
    LoaderMagazine,
    LoadError,
  ],
  templateUrl: './home.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './home.css',
})
export class Home {
  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);

  //Blogs
  blogPostsRef = this.blogPostService.getAllBlogPosts();
  blogsLoading: Signal<boolean> = this.blogPostsRef.isLoading;
  blogsError: Signal<Error | undefined> = this.blogPostsRef.error;
  blogPosts: WritableSignal<BlogPost[] | undefined> = this.blogPostsRef.value;
  blogsStatus = this.blogPostsRef.status;

  //Categories
  categoriesRef = this.categoryService.getAllCategories();
  categoriesLoading: Signal<boolean> = this.categoriesRef.isLoading;
  categories: WritableSignal<Category[] | undefined> = this.categoriesRef.value;

  openCategories = signal<Set<string>>(new Set());

  toggleCategory(id: string) {
    this.openCategories.update((set) => {
      const newSet = new Set(set);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }

  isOpen(id: string) {
    return this.openCategories().has(id);
  }

  constructor() {
    effect(() => {
      console.log('status:', this.blogsStatus());
    });
  }
}

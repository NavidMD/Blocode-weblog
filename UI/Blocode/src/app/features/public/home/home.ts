import { Component, CUSTOM_ELEMENTS_SCHEMA , inject, Signal, signal, WritableSignal } from '@angular/core';
import { BlogPostService } from '../../blogpost/services/blog-post-service';
import { BlogPost } from '../../blogpost/models/blogpost.model';
import { CategoryService } from '../../category/services/category-service';
import { Category } from '../../category/models/category.model';
import { Loader } from "../../../shared/components/loader/loader";
import { register } from 'swiper/element/bundle';
import { ɵInternalFormsSharedModule } from "@angular/forms";

register();

@Component({
  selector: 'app-home',
  imports: [Loader, ɵInternalFormsSharedModule],
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
  blogPosts: WritableSignal<BlogPost[] | undefined> = this.blogPostsRef.value;

  //Categories
  categoriesRef = this.categoryService.getAllCategories();
  categoriesLoading: Signal<boolean> = this.categoriesRef.isLoading;
  categories: WritableSignal<Category[] | undefined> = this.categoriesRef.value;
}

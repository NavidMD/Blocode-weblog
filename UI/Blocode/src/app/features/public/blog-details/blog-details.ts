import { Component, effect, inject, input, signal, Signal, WritableSignal } from '@angular/core';
import { LoaderMagazine } from '../../../shared/components/loader-magazine/loader-magazine';
import { BlogPostService } from '../../blogpost/services/blog-post-service';
import { CategoryService } from '../../category/services/category-service';
import { BlogPost } from '../../blogpost/models/blogpost.model';
import { Category } from '../../category/models/category.model';
import { RouterLink } from '@angular/router';
import { PersianDatePipe } from '../../../shared/pipes/persian-date-pipe';
import { LoadError } from '../../../shared/components/load-error/load-error';
import { MarkdownComponent } from "ngx-markdown";

@Component({
  selector: 'app-blog-details',
  imports: [LoaderMagazine, RouterLink, PersianDatePipe, LoadError, MarkdownComponent],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  url = input<string | undefined>();

  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);

  // Blog Detail
  blogDetailRef = this.blogPostService.getBlogPostByUrlHandle(this.url);
  blogDetailLoading: Signal<boolean> = this.blogDetailRef.isLoading;
  blogDetailError: Signal<Error | undefined> = this.blogDetailRef.error;
  blogDetail: WritableSignal<BlogPost | undefined> = this.blogDetailRef.value;
  blogDetailStatus = this.blogDetailRef.status;

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

  relatedBlogs: WritableSignal<BlogPost[] | undefined> = signal(undefined);
  relatedCategories: WritableSignal<Category[] | null | undefined> = signal(undefined);

  constructor() {
    effect(() => {
      if (this.url()) {
        const currentBlogCategories = this.blogDetail()?.categories.map((c) => c.name);
        if (currentBlogCategories?.length) {
          // یافتن مقاله های مرتبط
          const relatedBlogs = this.blogPosts()?.filter((b) =>
            b.categories.some((c) => currentBlogCategories.includes(c.name)),
          );
          this.relatedBlogs.set(relatedBlogs);

          // یافتن دسته بندی های مرتبط
          const mainCategory = this.categories()?.find((c) =>
            currentBlogCategories.includes(c.name),
          );
          const subCategory = mainCategory?.subCategories?.find((sc) =>
            currentBlogCategories.includes(sc.name),
          );

          const relatedCategories = subCategory?.subCategories?.length
            ? subCategory.subCategories // سطح آخر
            : mainCategory?.subCategories; // سطح 2

          this.relatedCategories.set(relatedCategories)
        }
      }
    });
  }

  getQueryParams() {
    const related = this.relatedBlogs();
    if (!related?.length) return {};
    return {
      categories: related
        .map((b) => b.categories.map((c) => c.urlHandle))
        .flat()
        .join(','),
    };
  }
}

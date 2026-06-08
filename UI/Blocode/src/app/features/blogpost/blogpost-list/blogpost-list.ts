import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../category/services/category-service';
import { BlogPostService } from '../services/blog-post-service';
import { BlogPost } from '../models/blogpost.model';

@Component({
  selector: 'app-blogpost-list',
  imports: [RouterLink],
  templateUrl: './blogpost-list.html',
  styleUrl: './blogpost-list.css',
})
export class BlogpostList {
  blogpostService = inject(BlogPostService);
  addBlogActive: boolean = false;
  router = inject(Router);

  private getAllBlogPostsRef = this.blogpostService.getAllBlogPosts();

  loading: Signal<boolean> = this.getAllBlogPostsRef.isLoading;
  error: Signal<Error | undefined> = this.getAllBlogPostsRef.error;
  value: WritableSignal<BlogPost[] | undefined> = this.getAllBlogPostsRef.value;

  toPersianFormatDate(date: string) {
    const convertingDate = new Date(date);
    const result = new Intl.DateTimeFormat('fa-IR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(convertingDate);
    return result;
  }


  deleteBlog(id: string) {
    if (id) {
      this.blogpostService.deleteBlogPost(id).subscribe({
        next: (response) => {
          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigateByUrl(currentUrl);
          });
          console.log('deleted', response);
        },
        error: () => {
          console.log('something went wrong');
        },
      });
    }
  }
}

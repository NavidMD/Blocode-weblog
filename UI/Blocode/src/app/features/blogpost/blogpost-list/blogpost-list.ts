import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  private getAllBlogPostsRef = this.blogpostService.getAllBlogPosts();

  loading: Signal<boolean> = this.getAllBlogPostsRef.isLoading;
  error: Signal<Error | undefined> = this.getAllBlogPostsRef.error;
  value: WritableSignal<BlogPost[] | undefined> = this.getAllBlogPostsRef.value;


}

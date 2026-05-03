import { Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NewBlogPostRequestValuesDTO, BlogPost } from '../models/blogpost.model';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor(private http: HttpClient) {}
  private readonly baseUrl = environment.apiBaseUrl;

  addBlogPostStatusSignal = signal<"idle" | "loading" | "error" | "success">("idle");

  //HTTP POST
  addBlogPost(newBlogPostDTO: NewBlogPostRequestValuesDTO) {
    this.addBlogPostStatusSignal.set('loading');
    this.http.post<BlogPost>(`${this.baseUrl}/api/blogs`, newBlogPostDTO).subscribe({
      next: (res) => {
        console.log("blog added",res);
        this.addBlogPostStatusSignal.set("success")
      },
      error: () => {
        this.addBlogPostStatusSignal.set('error');
      }
    })
  }
}

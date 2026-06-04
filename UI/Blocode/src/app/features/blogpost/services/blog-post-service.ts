import { Injectable, InputSignal, Signal, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, httpResource, HttpResourceRef, HttpResponse } from '@angular/common/http';
import { NewBlogPostRequestValuesDTO, BlogPost, EditBlogPostRequestValuesDTO } from '../models/blogpost.model';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor(private http: HttpClient) {}
  private readonly baseUrl = environment.apiBaseUrl;

  addBlogPostStatusSignal = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  getAllBlogPostsStatusSignal = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  //HTTP GET
  getAllBlogPosts() : HttpResourceRef<BlogPost[] | undefined> {
    return httpResource<BlogPost[]>(() => `${this.baseUrl}/api/blogs`)
  }

  getBlogPost(id: InputSignal<string | undefined>) : HttpResourceRef<BlogPost | undefined> {
    return httpResource<BlogPost>(() => `${this.baseUrl}/api/blogs/${id()}`);
  }

  //HTTP POST
  addBlogPost(newBlogPostDTO: NewBlogPostRequestValuesDTO) {
    this.addBlogPostStatusSignal.set('loading');
    this.http.post<BlogPost>(`${this.baseUrl}/api/blogs`, newBlogPostDTO).subscribe({
      next: (res) => {
        console.log('blog added', res);
        this.addBlogPostStatusSignal.set('success');
      },
      error: () => {
        this.addBlogPostStatusSignal.set('error');
      },
    });
  }

  //HTTP PUT
  editBlogPost(id: string, editedBlogPostDTO: EditBlogPostRequestValuesDTO) {
    return this.http.put<BlogPost>(`${this.baseUrl}/api/blogs/${id}`, editedBlogPostDTO);
  }
}

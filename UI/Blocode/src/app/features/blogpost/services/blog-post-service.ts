import { Injectable, InputSignal, Signal, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  HttpClient,
  HttpParams,
  httpResource,
  HttpResourceRef,
  HttpResponse,
} from '@angular/common/http';
import {
  NewBlogPostRequestValuesDTO,
  BlogPost,
  EditBlogPostRequestValuesDTO,
} from '../models/blogpost.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor(private http: HttpClient) {}
  private readonly baseUrl = environment.apiBaseUrl;

  addBlogPostStatusSignal = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  getAllBlogPostsStatusSignal = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  //HTTP GET
  getAllBlogPosts(): HttpResourceRef<BlogPost[] | undefined> {
    return httpResource<BlogPost[]>(() => `${this.baseUrl}/api/blogs`);
  }

  getBlogPost(id: InputSignal<string | undefined>): HttpResourceRef<BlogPost | undefined> {
    return httpResource<BlogPost>(() => `${this.baseUrl}/api/blogs/${id()}`);
  }

  getBlogPostsByCategoryName(
    categoryName: InputSignal<string | undefined>,
  ): HttpResourceRef<BlogPost[] | undefined> {
    return httpResource<BlogPost[]>(() => `${this.baseUrl}/api/blogs/byCategory/${categoryName()}`);
  }

  getBlogPostByUrlHandle(
    url: InputSignal<string | undefined>,
  ): HttpResourceRef<BlogPost | undefined> {
    return httpResource<BlogPost>(() => `${this.baseUrl}/api/blogs/${url()}`);
  }

  getBlogsFromAdvancedSearch(searchWord: string,selectedCategory: string): Observable<BlogPost[] | []> {
    let params = new HttpParams().set('searchWord', searchWord);
    if (selectedCategory !== 'در دسته بندی' && selectedCategory !== 'بدون دسته بندی') {
      params = params.set('selectedCategory', selectedCategory);
    }
    return this.http.get<BlogPost[] | []>(`${this.baseUrl}/api/blogs/searchByWordAndCategory`, { params });
  }

  //HTTP POST
  addBlogPost(newBlogPostDTO: NewBlogPostRequestValuesDTO) {
    this.addBlogPostStatusSignal.set('loading');
    this.http
      .post<BlogPost>(`${this.baseUrl}/api/blogs`, newBlogPostDTO, {
        withCredentials: true,
      })
      .subscribe({
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
    return this.http.put<BlogPost>(`${this.baseUrl}/api/blogs/${id}`, editedBlogPostDTO, {
      withCredentials: true,
    });
  }

  //HTTP DELETE
  deleteBlogPost(id: string) {
    return this.http.delete<BlogPost>(`${this.baseUrl}/api/blogs/${id}`, { withCredentials: true });
  }
}

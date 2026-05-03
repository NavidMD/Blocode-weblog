import { Component, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogPostService } from '../services/blog-post-service';
import { NewBlogPostRequestValuesDTO } from '../models/blogpost.model';

@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css',
})
export class AddBlogpost {
  constructor(
    private blogpostService: BlogPostService,
    private router: Router,
  ) {
    effect(() => {
      if (this.blogpostService.addBlogPostStatusSignal() === 'success') {
        this.blogpostService.addBlogPostStatusSignal.set('idle');
        this.router.navigate(['/admin', 'blogs']);
      }
      if (this.blogpostService.addBlogPostStatusSignal() === 'error') {
        console.log('error');
      }
    });
  }

  newBlogPostForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(100)],
    }),
    shortDescription: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(150)],
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(50)],
    }),
    featuredImageUrl: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(50)],
    }),
    publishedDate: new FormControl<string>(new Date().toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    author: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(50)],
    }),
    isVisible: new FormControl<boolean>(true, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  createBlogPost(event: Event) {
    event.preventDefault();
    if (this.newBlogPostForm.valid) {
      const formValues = this.newBlogPostForm.getRawValue();
      const createdBlogDTO: NewBlogPostRequestValuesDTO = {
        title: formValues.title,
        shortDescription: formValues.shortDescription,
        content: formValues.content,
        urlHandle: formValues.urlHandle,
        author: formValues.author,
        featuredImageUrl: formValues.featuredImageUrl,
        publishedDate: formValues.publishedDate,
        isVisible: formValues.isVisible,
      };

      this.blogpostService.addBlogPost(createdBlogDTO);
      this.newBlogPostForm.reset();
    }
  }
}

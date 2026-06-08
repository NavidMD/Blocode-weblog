import { Component, effect, inject, input, Signal, signal, WritableSignal } from '@angular/core';
import { BlogPostService } from '../services/blog-post-service';
import { BlogPost, EditBlogPostRequestValuesDTO } from '../models/blogpost.model';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../category/services/category-service';
import { Category } from '../../category/models/category.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { ToastrService } from 'ngx-toastr';
import { NgClass, NgIf } from '@angular/common';
import { ImageSelector } from '../../../shared/components/image-selector/image-selector';

@Component({
  selector: 'app-edit-blogpost',
  imports: [ReactiveFormsModule, MarkdownComponent, NgClass, NgIf, RouterLink, ImageSelector],
  templateUrl: './edit-blogpost.html',  
  styleUrls: ['./edit-blogpost.css'],
})
export class EditBlogpost {
  id = input<string>();
  blogpostService = inject(BlogPostService);
  categoryService = inject(CategoryService);
  toastService = inject(ToastrService);
  constructor(private router: Router) {
    effect(() => {
      const data = this.allCategoriesValue();
      if (data) {
        this.filteredCategories.set(data);
      }
    });
  }

  private getBlogPostRef = this.blogpostService.getBlogPost(this.id);

  isLoading: Signal<boolean> = this.getBlogPostRef.isLoading;
  error: Signal<Error | undefined> = this.getBlogPostRef.error;
  fetchedBlogPost: WritableSignal<BlogPost | undefined> = this.getBlogPostRef.value;

  private getAllCategoriesRef = this.categoryService.getAllCategories();

  allCategoriesValue: WritableSignal<Category[] | undefined> = this.getAllCategoriesRef.value;
  filteredCategories = signal<Category[] | undefined>([]);
  categoriesSelected: Category[] | undefined;

  editBlogPostForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(80)],
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

  patchValuesEffect = effect(() => {
    if (this.fetchedBlogPost()) {
      this.editBlogPostForm.patchValue({
        title: this.fetchedBlogPost()?.title,
        author: this.fetchedBlogPost()?.author,
        content: this.fetchedBlogPost()?.content,
        shortDescription: this.fetchedBlogPost()?.content,
        urlHandle: this.fetchedBlogPost()?.urlHandle,
        featuredImageUrl: this.fetchedBlogPost()?.featuredImageUrl,
        publishedDate: new Date(this.fetchedBlogPost()?.publishedDate!).toISOString().split('T')[0],
        isVisible: this.fetchedBlogPost()?.isVisible,
      });
      this.categoriesSelected = this.fetchedBlogPost()?.categories;
    }
  });

  clearSelectedCategories() {
    this.categoriesSelected = [];
  }

  toggleCategorySelection(event: Category) {
    if (this.categoriesSelected?.some((i) => i.id == event.id)) {
      this.categoriesSelected = this.categoriesSelected.filter((i) => i.id != event.id);
    } else {
      this.categoriesSelected?.push(event);
    }
  }

  searchCategory(input: HTMLInputElement) {
    const searchValue = input.value.toLowerCase();
    const orgCategories = this.allCategoriesValue();
    if (!orgCategories) return;
    if (!searchValue) {
      this.filteredCategories.set(orgCategories);
      return;
    } else {
      const filtered = orgCategories.filter((c) => c.name.toLowerCase().startsWith(searchValue));
      this.filteredCategories.set(filtered);
    }
  }

  editBlogPost() {
    const id = this.id();
    const formValues = this.editBlogPostForm.getRawValue();
    if (this.editBlogPostForm.valid && id) {
      const editedBlogPost: EditBlogPostRequestValuesDTO = {
        title: formValues.title,
        author: formValues.author,
        content: formValues.content,
        shortDescription: formValues.shortDescription,
        publishedDate: new Date(formValues.publishedDate),
        isVisible: formValues.isVisible,
        featuredImageUrl: formValues.featuredImageUrl,
        urlHandle: formValues.urlHandle,
        categories: this.categoriesSelected?.map((c) => c.id) ?? [],
      };

      this.blogpostService.editBlogPost(id, editedBlogPost).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/', 'admin', 'blogs']);
            this.toastService.success('مقاله با موفقیت ویرایش شد', '', {
              progressBar: true,
              timeOut: 3000,
            });
          }
        },
        error: (err) => {
          this.toastService.error('خطا در ارتباط با سرور', `${err.status}`, {
            progressBar: true,
            timeOut: 3000,
          });
        },
      });
    }
  }

  deleteBlog() {
    const id = this.id();
    if (id) {
      this.blogpostService.deleteBlogPost(id).subscribe({
        next: (response) => {
          this.router.navigate(['/admin/blogs']);
          this.toastService.success('مقاله با موفقیت حذف شد', '', {
            progressBar: true,
            timeOut: 3000,
          });
        },
        error: (err) => {
          this.toastService.error('خطا در ارتباط با سرور', `${err.status}`, {
            progressBar: true,
            timeOut: 3000,
          });
        },
      });
    }
  }
}

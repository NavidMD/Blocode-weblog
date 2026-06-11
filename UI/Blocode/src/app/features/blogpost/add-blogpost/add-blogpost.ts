import { Component, effect, inject, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogPostService } from '../services/blog-post-service';
import { NewBlogPostRequestValuesDTO } from '../models/blogpost.model';
import { MarkdownComponent, MarkdownModule } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category-service';
import { Category } from '../../category/models/category.model';
import { ToastrService } from 'ngx-toastr';
import { NgClass, NgIf } from '@angular/common';
import { ImageSelectorService } from '../../../shared/services/image-selector-service';
import { ImageSelector } from "../../../shared/components/image-selector/image-selector";

@Component({
  selector: 'app-add-blogpost',
  imports: [ReactiveFormsModule, RouterLink, MarkdownComponent, NgClass, NgIf, ImageSelector],
  templateUrl: './add-blogpost.html',
  styleUrls: ['./add-blogpost.css'],
})
export class AddBlogpost {
  toastService = inject(ToastrService);
  categoryService = inject(CategoryService);
  imageSelectorService = inject(ImageSelectorService);
  constructor(
    private blogpostService: BlogPostService,
    private router: Router,
  ) {

    effect(() => {
      if (this.blogpostService.addBlogPostStatusSignal() === 'success') {
        this.blogpostService.addBlogPostStatusSignal.set('idle');
        this.router.navigate(['/admin', 'blogs']);
        this.toastService.success('مقاله با موفقیت ایجاد شد','',{
          progressBar: true,
          timeOut: 3000,
        })
      }
      if (this.blogpostService.addBlogPostStatusSignal() === 'error') {
        this.toastService.success('خطا در ارتباط با سرور','',{
          progressBar: true,
          timeOut: 3000,
        })
      }
    });
    effect(() => {
      const data = this.allCategoriesValue();
      if (data) {
        this.filteredCategories.set(data);
      }
    });
  }

  private getAllCategoriesRef = this.categoryService.getAllCategories();

  allCategoriesValue: WritableSignal<Category[] | undefined> = this.getAllCategoriesRef.value;
  filteredCategories = signal<Category[] | undefined>([]);
  categoriesSelected: Category[] = [];

  newBlogPostForm = new FormGroup({
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

  toggleCategorySelection(event: Category) {
    if (this.categoriesSelected.some((i) => i.id == event.id)) {
      this.categoriesSelected = this.categoriesSelected.filter((i) => i.id != event.id);
    } else {
      this.categoriesSelected.push(event);
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

  clearSelectedCategories() {
    this.categoriesSelected = [];
  }

  openImageSelector() {
    this.imageSelectorService.display();
  }

  selectedImageEffect = effect(() => {
    const selectedImageUrl = this.imageSelectorService.selectedImage();
    if (selectedImageUrl) {
      this.newBlogPostForm.patchValue({ featuredImageUrl: selectedImageUrl });
    }
  });

  createBlogPost(event: Event) {
    event.preventDefault();
    console.log(this.newBlogPostForm);

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
        categories: this.categoriesSelected.map((i) => i.id),
      };

      this.blogpostService.addBlogPost(createdBlogDTO);
      this.newBlogPostForm.reset();
    }
  }
}

import { Component, effect, inject, input, signal, Signal } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { Category } from '../models/category.model';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {
  private categoryService = inject(CategoryService);
  editCategoryActive: boolean = false;
  id = input<string>();

  getCategoryByIdReference = this.categoryService.getCategoryById(this.id);

  isLoading: Signal<boolean> = this.getCategoryByIdReference.isLoading;
  isError: Signal<Error | undefined> = this.getCategoryByIdReference.error;
  categoryByIdValue: Signal<Category | undefined> = this.getCategoryByIdReference.value;

  editCategoryFormGroup = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    urlHandle: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  get categoryNameInput() {
    return this.editCategoryFormGroup.controls.name;
  }

  get categoryUrlHandleInput() {
    return this.editCategoryFormGroup.controls.urlHandle;
  }

  effectRef = effect(() => {
    this.editCategoryFormGroup.controls.name.patchValue(this.categoryByIdValue()?.name ?? '');
    this.editCategoryFormGroup.controls.urlHandle.patchValue(
      this.categoryByIdValue()?.urlHandle ?? '',
    );
  });

  onSubmit(event: Event) {
    event.preventDefault();
    console.log(this.editCategoryFormGroup.getRawValue());
  }
}

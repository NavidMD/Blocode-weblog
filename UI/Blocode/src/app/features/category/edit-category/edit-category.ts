import { Component, effect, inject, input, signal, Signal } from '@angular/core';
import { CategoryService } from '../services/category-service';
import { Category, UpdateCategoryRequestValuesDTO } from '../models/category.model';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

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
  changeState: boolean = false;

  subscription = new Subscription();

  constructor(private router: Router) {
    effect(() => {
      if (this.categoryService.updateCategoryStatusSignal() === 'success') {
        this.categoryService.updateCategoryStatusSignal.set('idle');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(this.router.url);
        });
      }
      if (this.categoryService.updateCategoryStatusSignal() === 'error') {
        console.log('updating category failed in database!');
      }
    });
  }

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

  listenOnFormChange() {
    this.subscription = this.editCategoryFormGroup.valueChanges.subscribe((value) => {
      if (
        value.name === this.categoryByIdValue()?.name! &&
        value.urlHandle === this.categoryByIdValue()?.urlHandle!
      ) {
        return (this.changeState = false);
      } else {
        return (this.changeState = true);
      }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.changeState === true && this.editCategoryFormGroup.valid && this.id()) {
      const editCategoryFormValue = this.editCategoryFormGroup.getRawValue();
      const newCategoryDataByUserDTO: UpdateCategoryRequestValuesDTO = {
        name: editCategoryFormValue.name,
        urlHandle: editCategoryFormValue.urlHandle,
      };

      this.categoryService.updateCategory(this.id(), newCategoryDataByUserDTO);
      this.editCategoryFormGroup.reset({ name: '', urlHandle: '' });
      this.subscription.unsubscribe();
    }
  }
}

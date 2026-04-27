import { Component, effect, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../services/category-service';
import { NewCategoryRequestValues } from '../models/category.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  @Output() cancelAdding: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    private categoryService: CategoryService,
    private router: Router,
  ) {
    effect(() => {
      if (this.categoryService.addCategoryStatusSignal() === 'success') {
        this.categoryService.addCategoryStatusSignal.set('idle');
        const currentUrl = this.router.url;
        //refreshing current url to sync data
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
        console.log('adding category succeeded in database');
      }
      if (this.categoryService.addCategoryStatusSignal() === 'error') {
        console.log('adding category failed in database!');
      }
    });
  }

  cancelAddingCategory() {
    this.cancelAdding.emit(false);
  }

  addCategoryFormGroup = new FormGroup({
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
    return this.addCategoryFormGroup.controls.name;
  }

  get categoryUrlHandleInput() {
    return this.addCategoryFormGroup.controls.urlHandle;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const addCategoryFormValue = this.addCategoryFormGroup.getRawValue();
    const newCategoryDataByUserDTO: NewCategoryRequestValues = {
      name: addCategoryFormValue.name,
      urlHandle: addCategoryFormValue.urlHandle,
    };
    if (newCategoryDataByUserDTO && this.addCategoryFormGroup.valid) {
      this.categoryService.addCategory(newCategoryDataByUserDTO);
      this.addCategoryFormGroup.reset({ name: '', urlHandle: '' });
    }
  }
}

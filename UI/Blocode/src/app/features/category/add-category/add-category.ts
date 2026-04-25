import { Component, effect, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../services/category-service';
import { NewCategoryRequestValues } from '../models/category.model';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  @Output() cancelAdding: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(private categoryService: CategoryService) {
    effect(() => {
      if (this.categoryService.addCategoryStatusSignal() === 'success') {
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

  onSubmit() {
    const addCategoryFormValue = this.addCategoryFormGroup.getRawValue();
    const newCategoryInsertedDataByUserDTO: NewCategoryRequestValues = {
      name: addCategoryFormValue.name,
      urlHandle: addCategoryFormValue.urlHandle,
    };
    if (newCategoryInsertedDataByUserDTO) {
      this.categoryService.AddCategory(newCategoryInsertedDataByUserDTO);
    }
  }
}

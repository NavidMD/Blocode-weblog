import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  @Output() cancelAdding: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    console.log(this.addCategoryFormGroup.getRawValue());
  }
}

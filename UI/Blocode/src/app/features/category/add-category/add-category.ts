import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../services/category-service';
import { NewCategoryRequestValuesDTO } from '../models/category.model';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  @Output() cancelAdding: EventEmitter<boolean> = new EventEmitter<boolean>();
  toastService = inject(ToastrService);

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
        this.toastService.success('دسته بندی با موفقیت ایجاد شد','',{
          progressBar: true,
          timeOut: 3000,
        })
      }
      if (this.categoryService.addCategoryStatusSignal() === 'error') {
        this.toastService.error('خطا در ارتباط با سرور','',{
          progressBar: true,
          timeOut: 3000,
        })
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
    if (this.addCategoryFormGroup.valid) {
      const addCategoryFormValue = this.addCategoryFormGroup.getRawValue();
      const newCategoryDataByUserDTO: NewCategoryRequestValuesDTO = {
        name: addCategoryFormValue.name,
        urlHandle: addCategoryFormValue.urlHandle,
      };

      this.categoryService.addCategory(newCategoryDataByUserDTO);
      this.addCategoryFormGroup.reset({ name: '', urlHandle: '' });
    }
  }
}

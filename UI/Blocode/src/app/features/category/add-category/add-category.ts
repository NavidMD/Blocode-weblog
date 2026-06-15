import {
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  Signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../services/category-service';
import { Category, NewCategoryRequestValuesDTO } from '../models/category.model';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Loader } from '../../../shared/components/loader/loader';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule, NgClass, NgIf, Loader],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
  encapsulation: ViewEncapsulation.None
})
export class AddCategory {
  @Output() cancelAdding: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('categories') categories: Category[] | undefined;
  @Input('categoriesLoading') categoriesLoading!: boolean;
  @Input('categoriesError') categoriesError: Error | undefined;
  toastService = inject(ToastrService);
  document = inject(DOCUMENT);

  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdown = this.document.getElementById('dropdown');
    const dropdownBtn = this.document.getElementById('dropdown-input');
    const clickedElement = event.target as HTMLElement;
    if(clickedElement.id === 'dropdown' || clickedElement.id === 'dropdown-input') {
      return;
    }
    else {
      dropdown?.classList.add('hidden');
      dropdownBtn?.querySelector('svg')?.classList.remove('rotate-180')
    }
  }

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
        this.toastService.success('دسته بندی با موفقیت ایجاد شد', '', {
          progressBar: true,
          timeOut: 3000,
        });
      }
      if (this.categoryService.addCategoryStatusSignal() === 'error') {
        this.toastService.error('خطا در ارتباط با سرور', '', {
          progressBar: true,
          timeOut: 3000,
        });
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
  parentCategoryId: string = '';
  parentCategoryName: string | undefined = 'بدون دسته بندی اصلی';

  get categoryNameInput() {
    return this.addCategoryFormGroup.controls.name;
  }

  get categoryUrlHandleInput() {
    return this.addCategoryFormGroup.controls.urlHandle;
  }

  toggleDropdown(dropdown: HTMLElement) {
    if (dropdown.classList.contains('hidden')) {
      dropdown.classList.remove('hidden');
      document.getElementById('dropdown-input')?.querySelector('svg')?.classList.add('rotate-180');
    } else {
      document
        .getElementById('dropdown-input')
        ?.querySelector('svg')
        ?.classList.remove('rotate-180');
      dropdown.classList.add('hidden');
    }
  }

  selectParentCategory(event: Event, id: string | '') {
    const selectedElm = event.target as HTMLElement;
    if(id == '') {
      this.parentCategoryName = 'بدون دسته بندی اصلی';
      return;
    }
    this.parentCategoryName = selectedElm.querySelector('.parentCatOptionName')?.textContent;
    this.parentCategoryId = id;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.addCategoryFormGroup.valid) {
      const addCategoryFormValue = this.addCategoryFormGroup.getRawValue();
      const newCategoryDataByUserDTO: NewCategoryRequestValuesDTO = {
        name: addCategoryFormValue.name,
        urlHandle: addCategoryFormValue.urlHandle,
        parentCategoryId: this.parentCategoryId ? this.parentCategoryId : null
      };

      this.categoryService.addCategory(newCategoryDataByUserDTO);
      this.addCategoryFormGroup.reset({ name: '', urlHandle: '' });
      this.parentCategoryId = '',
      this.parentCategoryName = 'بدون دسته بندی اصلی'
    }
  }
}

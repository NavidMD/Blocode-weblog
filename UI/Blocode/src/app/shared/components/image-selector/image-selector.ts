import { Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { ImageSelectorService } from '../../services/image-selector-service';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogImage } from '../../models/image.model';
import { Loader } from '../loader/loader';

@Component({
  selector: 'app-image-selector',
  imports: [NgClass, ReactiveFormsModule, Loader],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector {
  private imageSelectorService = inject(ImageSelectorService);
  showImageSelector = this.imageSelectorService.showImageSelector.asReadonly();

  id = signal<string | undefined>(undefined);

  getAllImagesRef = this.imageSelectorService.getAllImages(this.id);

  isloading: Signal<boolean> = this.getAllImagesRef.isLoading;
  allImages: WritableSignal<BlogImage[] | undefined> = this.getAllImagesRef.value;

  closeImageSelector() {
    this.imageSelectorService.close();
  }

  imageSelectorUploadForm = new FormGroup({
    file: new FormControl<File | null | undefined>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
  });

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const selectedFile = input.files[0];
    this.imageSelectorUploadForm.patchValue({
      file: selectedFile,
    });
  }

  onSelectImage(image: BlogImage) {
    this.imageSelectorService.selectImage(image.url);
  }

  submitImages() {
    if (this.imageSelectorUploadForm.valid) {
      const formRawValues = this.imageSelectorUploadForm.getRawValue();
      this.imageSelectorService
        .uploadImageToApi(formRawValues.file!, formRawValues.name, formRawValues.title)
        .subscribe({
          next: (res) => {
            this.id.set(res.id);
            this.imageSelectorUploadForm.reset();
          },
          error: (err) => {
            console.error(err);
          },
        });
    }
  }
}

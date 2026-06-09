import { Component, inject } from '@angular/core';
import { ImageSelectorService } from '../../services/image-selector-service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-image-selector',
  imports: [NgClass],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector {
  private imageSelectorService = inject(ImageSelectorService);
  showImageSelector = this.imageSelectorService.showImageSelector.asReadonly();

  closeImageSelector() {
    this.imageSelectorService.close();
  }
}

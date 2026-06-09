import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {
  showImageSelector = signal<boolean>(false);

  display() {
    this.showImageSelector.set(true);
  }
  close() {
    this.showImageSelector.set(false);
  }
}

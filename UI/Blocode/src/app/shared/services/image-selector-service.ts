import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogImage } from '../models/image.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {
  showImageSelector = signal<boolean>(false);
  http = inject(HttpClient);

  display() {
    this.showImageSelector.set(true);
  }
  close() {
    this.showImageSelector.set(false);
  }

  uploadImageToApi(file: File, fileName: string, title: string): Observable<BlogImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);

    return this.http.post<BlogImage>(`${environment.apiBaseUrl}/api/images`, formData);
  }

  getAllImages(id: WritableSignal<string | undefined>): HttpResourceRef<BlogImage[] | undefined> {
    return httpResource<BlogImage[]>(() =>  {
      id()
      return `${environment.apiBaseUrl}/api/images`
    })
  }
}

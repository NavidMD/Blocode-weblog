import { Component, input } from '@angular/core';

@Component({
  selector: 'app-blog-details',
  imports: [],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  url = input<string | undefined>();
}

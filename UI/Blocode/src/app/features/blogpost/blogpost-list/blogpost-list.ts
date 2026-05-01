import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-blogpost-list',
  imports: [RouterLink],
  templateUrl: './blogpost-list.html',
  styleUrl: './blogpost-list.css',
})
export class BlogpostList {
  addBlogActive: boolean = false;
}

import { Category } from "../../category/models/category.model";

export interface BlogPost {
  id: string,
  title: string;
  shortDescription: string;
  content: string;
  featuredImageUrl: string;
  urlHandle: string;
  publishedDate: string;
  author: string;
  isVisible: boolean;
  categories: Category[]
}

// creating blogpost required data
export interface NewBlogPostRequestValuesDTO {
  title: string;
  shortDescription: string;
  content: string;
  featuredImageUrl: string;
  urlHandle: string;
  publishedDate: string;
  author: string;
  isVisible: boolean;
}

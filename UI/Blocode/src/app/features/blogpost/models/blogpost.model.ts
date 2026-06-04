import { Category } from '../../category/models/category.model';

// دیتاهایی که از سرور میاد

export interface BlogPost {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  featuredImageUrl: string;
  urlHandle: string;
  publishedDate: string;
  author: string;
  isVisible: boolean;
  categories: Category[];
}

// اطلاعاتی که کاربر میفرسته به API

export interface NewBlogPostRequestValuesDTO {
  title: string;
  shortDescription: string;
  content: string;
  featuredImageUrl: string;
  urlHandle: string;
  publishedDate: string;
  author: string;
  isVisible: boolean;
  categories: string[];
}

export interface EditBlogPostRequestValuesDTO {
  title: string;
  shortDescription: string;
  content: string;
  featuredImageUrl: string;
  urlHandle: string;
  publishedDate: Date;
  author: string;
  isVisible: boolean;
  categories: string[];
}

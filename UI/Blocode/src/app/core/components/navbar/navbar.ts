import {
  AfterViewInit,
  Component,
  DOCUMENT,
  effect,
  HostListener,
  inject,
  Inject,
  input,
  Input,
  OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { BlogPostService } from '../../../features/blogpost/services/blog-post-service';
import { CategoryService } from '../../../features/category/services/category-service';
import { BlogPost } from '../../../features/blogpost/models/blogpost.model';
import { Category } from '../../../features/category/models/category.model';
import { Loader } from '../../../shared/components/loader/loader';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Loader],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  private router = inject(Router);
  currentUrl: WritableSignal<string> = signal(this.router.url);

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((r) => {
      this.currentUrl.set(this.router.url);
      if(this.currentUrl().includes('/login') || this.currentUrl().includes('/register')) {
        this.showLoginBtn = false;
      }
      else {
        this.showLoginBtn = true
      }
    });
  }

  isDarkMode: boolean = false;
  authService = inject(AuthService);
  userInfoBoxOpen: boolean = false;
  showLoginBtn: boolean = false;

  blogPostService = inject(BlogPostService);
  categoryService = inject(CategoryService);

  //Blogs
  blogPostsRef = this.blogPostService.getAllBlogPosts();
  blogsLoading: Signal<boolean> = this.blogPostsRef.isLoading;
  blogPosts: WritableSignal<BlogPost[] | undefined> = this.blogPostsRef.value;

  //Categories
  categoriesRef = this.categoryService.getAllCategories();
  categoriesLoading: Signal<boolean> = this.categoriesRef.isLoading;
  categories: WritableSignal<Category[] | undefined> = this.categoriesRef.value;

  openCategories = signal<Set<string>>(new Set());

  toggleCategory(id: string) {
    this.openCategories.update((set) => {
      const newSet = new Set(set);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  }

  isOpen(id: string) {
    return this.openCategories().has(id);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    if (this.isDarkMode) {
      this.document.documentElement.classList.add('dark');
    }
  }
}

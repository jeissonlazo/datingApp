import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountServices } from '../../core/services/account-services';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastServices } from '../../core/services/toast-services';
import { themes } from '../theme';
@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav implements OnInit {
  protected accountService = inject(AccountServices);
  protected credentials: any = { email: '', password: '' };
  private router = inject(Router);
  private toastService = inject(ToastServices);
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleThemeChange(theme: string): void {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const element = document.activeElement as HTMLElement;
    if (element) {
      element.blur();
    }
  }

  login(): void {
    console.log('Attempting login with credentials:', this.credentials);
    this.accountService.login(this.credentials).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/members');
        this.credentials = { email: '', password: '' };
      },
      error: (error) => {
        this.toastService.error(error.error || 'Login failed. Please try again.');
      },
    });
  }

  logOut(): void {
    this.accountService.logOut();
    this.credentials = { email: '', password: '' };
    this.toastService.success('You have been logged out.');
  }
}

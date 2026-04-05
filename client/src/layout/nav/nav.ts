import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountServices } from '../../core/services/account-services';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ToastServices } from '../../core/services/toast-services';
@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  protected accountService = inject(AccountServices);
  protected credentials: any = {email: '',password: ''};
  private router = inject(Router);
  private toastService = inject(ToastServices);
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
    this.credentials = {email: '', password: ''};
    this.toastService.success('You have been logged out.');
  }
}

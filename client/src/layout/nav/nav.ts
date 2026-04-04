import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountServices } from '../../core/services/account-services';
@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  protected accountService = inject(AccountServices);
  protected credentials: any = {email: '',password: ''};

  login(): void {
    console.log('Logging in with credentials:', this.credentials);
    this.accountService.login(this.credentials).subscribe({
      next: (response) => {
        this.credentials = { email: '', password: '' };
      },
      error: (error) => {
      },
    });
  }

  logOut(): void {
    this.accountService.logOut();
    this.credentials = {email: '', password: ''};
  }
}

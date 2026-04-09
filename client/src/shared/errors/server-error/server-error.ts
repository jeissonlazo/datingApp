import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../../types/error';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.scss',
})
export class ServerError {
  protected error = signal<ApiError | null>(null);
  private router = inject(Router);
  protected showDetails = false;
  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { error: ApiError };
    this.error.set(state?.error || null);
  }

  detailsToggle() {
    this.showDetails = !this.showDetails;
  }
}

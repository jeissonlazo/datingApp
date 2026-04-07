import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountServices } from '../services/account-services';
import { ToastServices } from '../services/toast-services';

export const authGuard: CanActivateFn = () => {
  const accountService = inject(AccountServices);
  const toastService = inject(ToastServices);
  if (accountService.currentUser()) {
    return true;
  } else {
    toastService.error('You must be logged in to access this route.');
    return false;
  }
};

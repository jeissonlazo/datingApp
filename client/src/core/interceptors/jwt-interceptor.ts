import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountServices } from '../services/account-services';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const account  = inject(AccountServices);

  const user = account.currentUser();

  if (user) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  }
  return next(req);
};

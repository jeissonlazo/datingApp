import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastServices } from '../services/toast-services';
import { Router } from '@angular/router';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastServices);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      if(error){
        switch (error.status) {
          case 400:
            if(error.error.errors){
              const modelStateErrors = [];
              for(const key in error.error.errors){
                if(error.error.errors[key]){
                  modelStateErrors.push(error.error.errors[key]);
                }
              }
              throw modelStateErrors.flat();
            }else{
              toast.error(error.error, error.status);
            }
            break;

          case 401:
            toast.error('Unauthorized');
            break;
            
          case 404:
            router.navigate(['/not-found']);
            break;
          
          case 500:
            const navigationExtras = { state: { error: error.error } };
            router.navigate(['/server-error'], navigationExtras);
            toast.error('Server Error');
            break;
            
          default:
            toast.error('An error occurred');
            break;
        }
      }
      return throwError(() => error);
    })
  );
};

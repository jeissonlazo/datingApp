import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Busy } from '../services/busy';
import { finalize } from 'rxjs/internal/operators/finalize';
import { of, tap } from 'rxjs';

const cache = new Map<string, any>();
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const busy = inject(Busy);

  if(req.method === 'GET') {
    const cachedResponse = cache.get(req.url);
    if(cachedResponse) {
      return of(cachedResponse);
    }
  }

  busy.busy();

  return next(req).pipe(
    tap(Response => {
      cache.set(req.url, Response);
    }),
    finalize(() => busy.idle())
  );
};

import { inject, Injectable } from '@angular/core';
import { AccountServices } from './account-services';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountServices);

  InitService(): Observable<null> {
    const userJson = localStorage.getItem('user');
    if (!userJson) return of (null);
    const user = JSON.parse(userJson);
    this.accountService.currentUser.set(user);

    return of (null);
  }
}
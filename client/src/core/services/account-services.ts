import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCredentials, RegisterCredentials, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountServices {
  private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  login(credentials: LoginCredentials) {
    return this.http.post<User>(this.baseUrl + 'account/login', credentials).pipe(
      tap(user =>{
        if(user){
          this.setCurrentUser(user);
        };
      })
    );
  }

  register(credentials: RegisterCredentials) {
    return this.http.post<User>(this.baseUrl + 'account/register', credentials).pipe(
      tap(user => {
        if(user){
          this.setCurrentUser(user);
        }
      })
    )
  }

  logOut() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  setCurrentUser(user: User) {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
}

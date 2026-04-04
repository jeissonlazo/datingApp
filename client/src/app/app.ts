import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Nav } from "../layout/nav/nav";
import { AccountServices } from '../core/services/account-services';
import { Home } from "../features/home/home";
import { User } from '../types/user';

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('client');
  private accountService = inject(AccountServices);
  private http = inject(HttpClient);
  protected members = signal<User[]>([]);

  async ngOnInit(): Promise<void> {
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userJson = localStorage.getItem('user');
    if(!userJson) return;
    const user = JSON.parse(userJson);
    this.accountService.currentUser.set(user);
  }

  async getMembers(): Promise<User[]> {
    try {
      return await lastValueFrom(this.http.get<User[]>('https://localhost:5001/api/members'));
    }
    catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  }
}

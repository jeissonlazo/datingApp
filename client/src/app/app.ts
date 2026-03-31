import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('client');

  private http = inject(HttpClient);
  protected members = signal<any[]>([]);

  async ngOnInit(): Promise<void> {
    this.members.set(await this.getMembers());
  }

  async getMembers(): Promise<any[]> {
    try {
      return await lastValueFrom(this.http.get<any[]>('https://localhost:5001/api/members'));
    }
    catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  }
}

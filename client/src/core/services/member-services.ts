import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member, Photo } from '../../types/member';

@Injectable({
  providedIn: 'root',
})
export class MemberServices {
  private http = inject(HttpClient)
  private baseUrl = environment.apiUrl;

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'members');
  }

  getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + `members/${id}`);
  }

  getMemberPhots(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + `members/${id}/photos`);
  }
}

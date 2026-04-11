import { Component, inject } from '@angular/core';
import { MemberServices } from '../../../core/services/member-services';
import { Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from "../member-card/member-card";

@Component({
  selector: 'app-members-list',
  imports: [AsyncPipe, MemberCard],
  templateUrl: './members-list.html',
  styleUrl: './members-list.scss',
})
export class MembersList {

  private memberServices = inject(MemberServices);

  members$ = new Observable<Member[]>();

  constructor() {
    this.members$ = this.memberServices.getMembers();
  }

}

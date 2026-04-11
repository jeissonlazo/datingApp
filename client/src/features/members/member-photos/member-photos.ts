import { Component, inject } from '@angular/core';
import { MemberServices } from '../../../core/services/member-services';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Photo } from '../../../types/member';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-photos',
  imports: [AsyncPipe],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.scss',
})
export class MemberPhotos {
  private memberServices = inject(MemberServices);
  private route = inject(ActivatedRoute);
  protected photos$?: Observable<Photo[]>;

  constructor() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');

    if (memberId) {
      this.photos$ = this.memberServices.getMemberPhots(memberId);
    }
  }

  get photoMocks() {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      url: `https://picsum.photos/200/300?random=${i + 1}`,
      memberId: `member-${i + 1}`,
    }));
  }
}

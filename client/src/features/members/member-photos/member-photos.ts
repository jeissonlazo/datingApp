import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberServices } from '../../../core/services/member-services';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../types/member';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountServices } from '../../../core/services/account-services';
import { User } from '../../../types/user';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.scss',
})
export class MemberPhotos implements OnInit {
  protected memberServices = inject(MemberServices);
  private accountService = inject(AccountServices);
  private route = inject(ActivatedRoute);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);

  ngOnInit() {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberServices.getMemberPhots(memberId).subscribe({
        next: (photos) => this.photos.set(photos),
      });
    }
  }

  onPhotoUpload(file: File) {
    this.loading.set(true);
    this.memberServices.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberServices.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
      },
      error: () => {
        console.error('Photo upload failed');
        this.loading.set(false);
      }
    });
  }

  onSetMainPhoto(photo: Photo) {
    this.memberServices.setMainPhoto(photo.id).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser) currentUser.imageUrl = photo.url;
        this.accountService.setCurrentUser(currentUser as User);
        this.memberServices.member.update(member =>({
          ...member,
          imageUrl: photo.url
        }) as Member);
      }
    });
  }  
}

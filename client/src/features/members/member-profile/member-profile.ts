import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Member, MemberUpdate } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberServices } from '../../../core/services/member-services';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastServices } from '../../../core/services/toast-services';   
import { AccountServices } from '../../../core/services/account-services';
@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.scss',
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notifyUser($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }
  protected memberServices = inject(MemberServices);
  private toast = inject(ToastServices);
  private accountServices = inject(AccountServices);
  protected editableMember: MemberUpdate ={
    displayName: '',
    city: '',
    country: '',
    description: '',
  };

  ngOnInit(): void {

    this.editableMember = {
      displayName: this.memberServices.member()?.displayName || '',
      city: this.memberServices.member()?.city || '',
      country: this.memberServices.member()?.country || '',
      description: this.memberServices.member()?.description || '',
    };
  }
  ngOnDestroy(): void {
    this.memberServices.editMode.set(false);
  }

  updateProfile() {
    if (!this.memberServices.member()) return;

    const updatedMember: MemberUpdate = {
      ...this.memberServices.member(),
      ...this.editableMember,
    } as MemberUpdate;
    this.memberServices.updateMember(updatedMember).subscribe({
      next: () => {
        const currentUser = this.accountServices.currentUser();
        if(currentUser && updatedMember.displayName !== currentUser?.displayName) {
          currentUser.displayName = updatedMember.displayName;
          this.accountServices.setCurrentUser(currentUser);
        }
        this.toast.success('Profile updated successfully!');
        this.memberServices.editMode.set(false);
        this.memberServices.member.set(updatedMember as Member);
        this.editForm?.reset(this.editableMember);
      },
      error: () => {
        this.toast.error('Failed to update profile. Please try again.');
      }
    });
  }

}

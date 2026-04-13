import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/members/member-profile/member-profile';

export const preventUnsaveChangesGuard: CanDeactivateFn<MemberProfile> = (
  component,
) => {

  if(component.editForm?.dirty) {
    console.log('Form is dirty');
    return confirm('You have unsaved changes. Do you really want to leave?');
  }

  return true;
};

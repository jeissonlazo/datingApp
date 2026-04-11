import { ResolveFn, Router } from '@angular/router';
import { MemberServices } from '../../core/services/member-services';
import { inject } from '@angular/core';
import { Member } from '../../types/member';
import { EMPTY } from 'rxjs';

export const memberResolver: ResolveFn<Member > = (route, state) => {
  const memberService = inject(MemberServices);
  const router = inject(Router);
  const memberId = route.paramMap.get('id');


  if (!memberId) {
    router.navigate(['/not-found']);
    return EMPTY;
  }

  return memberService.getMember(memberId!);
};

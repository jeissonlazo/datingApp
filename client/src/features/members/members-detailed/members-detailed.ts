import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AccountServices } from '../../../core/services/account-services';
import { filter } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { MemberServices } from '../../../core/services/member-services';
@Component({
  selector: 'app-members-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './members-detailed.html',
  styleUrl: './members-detailed.scss',
})
export class MembersDetailed implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected memberServices = inject(MemberServices);
  private accountServices = inject(AccountServices);
  protected title = signal('Profile');
  protected isCurrentUser = computed(() => {
    return this.accountServices.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  });

  ngOnInit(): void {
  
    this.title.set(this.route.firstChild?.snapshot.title || 'Profile');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.title.set(this.route.firstChild?.snapshot.title || 'Profile');
    }
    )
  }

}

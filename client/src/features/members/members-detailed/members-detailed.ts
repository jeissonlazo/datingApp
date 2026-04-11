import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';
@Component({
  selector: 'app-members-detailed',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  templateUrl: './members-detailed.html',
  styleUrl: './members-detailed.scss',
})
export class MembersDetailed implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected member = signal<Member | undefined>(undefined);
  protected title = signal('Profile');

  ngOnInit(): void {
    
    this.route.data.subscribe( {
      next: (data) => {
        this.member.set(data['member']);
      }
    });

    this.title.set(this.route.firstChild?.snapshot.title || 'Profile');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.title.set(this.route.firstChild?.snapshot.title || 'Profile');
    }
    )
  }

}

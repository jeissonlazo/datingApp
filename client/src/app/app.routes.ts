import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MembersList } from '../features/members/members-list/members-list';
import { MembersDetailed } from '../features/members/members-detailed/members-detailed';
import { List } from '../features/list/list';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../core/guards/auth-guard';
import { TestErrors } from '../features/test-errors/test-errors';
export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {
        path: 'members',
        component: MembersList,
      },
      {
        path: 'members/:id',
        component: MembersDetailed,
      },
      {
        path: 'lists',
        component: List,
      },
      {
        path: 'messages',
        component: Messages,
      },
    ],
  },
  {
    path: 'errors',
    component: TestErrors,
  },
  {
    path: '**',
    component: Home,
  },
];

import { Component, Input, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { User } from '../../types/user';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected registerMode = signal(false);
  @Input({required: true}) members: User[] = [];
  showRegister() {
    this.registerMode.set(true);
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode.set(event);
  }

}

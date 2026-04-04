import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCredentials, User } from '../../../types/user';
import { AccountServices } from '../../../core/services/account-services';

@Component({
  selector: 'app-register',
  imports: [ FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private accountServices = inject(AccountServices);
  protected credentials = {} as RegisterCredentials;
  cancelRegister = output<boolean>();

  register(){
    console.log(this.credentials);
    this.accountServices.register(this.credentials).subscribe({
      next: user => {
        console.log(user);
        this.cancel();
      },
      error: error => console.log(error)
    });
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}

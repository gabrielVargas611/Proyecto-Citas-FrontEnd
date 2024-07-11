import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public user = signal('');
  public pass = signal('');

  public guardarUsuario(event: Event){
    let tagUser = event.target as HTMLInputElement;
    let tagpass = event.target as HTMLInputElement;
    localStorage.setItem('user',tagUser.value);
    localStorage.setItem('pass',tagpass.value);
    this.user.set(String(localStorage.getItem('user')));
    this.pass.set(String(localStorage.getItem('pass')));
  }
}

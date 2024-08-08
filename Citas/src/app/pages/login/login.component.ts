import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public user = signal('');
  public pass = signal('');

  public guardarUsuario(event: Event){
    /*let cuerpo ={
      user: this.user,
      pass: this.pass
    }*/
    localStorage.setItem('user',this.user());
    localStorage.setItem('pass',this.pass());
  }

  constructor(){
    this.user.set(String(localStorage.getItem('user')));
    this.pass.set(String(localStorage.getItem('pass')));
  }
}

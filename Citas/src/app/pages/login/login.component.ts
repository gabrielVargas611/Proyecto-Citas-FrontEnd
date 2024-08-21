import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { payload } from '../../../Model/payload';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public nombreDelUsuario: String="";
  public claveDelUsuario: String="";
  public id: Number =0;

 /* public guardarUsuario(event: Event){
    /*let cuerpo ={
      user: this.user,
      pass: this.pass
    }
    localStorage.setItem('user',this.user());
    localStorage.setItem('pass',this.pass());
  }*/
  public autenticar() {
    let cuerpo = {
      nombreDelUsuario: this.nombreDelUsuario,
      claveDelUsuario: this.claveDelUsuario,
      id: this.id
    };
    localStorage.setItem('nombreDelUsuario', String(this.nombreDelUsuario));
    this.http.post('http://localhost/usuarios/autenticar', cuerpo).subscribe((token) => {
      localStorage.setItem('Token', String(token));
      const encabezados = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(localStorage.getItem('Token'))
      });
      this.http.post('http://localhost/usuarios/validarToken', {}, { headers: encabezados }).subscribe((token) => {
        const datos = token as payload;
        localStorage.setItem('Rol', String(datos.Rol));
      });
    });
    this.router.navigate(['']);
  }

  public desautenticar() {
    let cuerpo = {
      nombreDelUsuario: this.nombreDelUsuario
    };
    this.http.post('http://localhost/usuarios/desautenticar', cuerpo).subscribe((token) => {
      localStorage.setItem('Token', "");
      localStorage.setItem('Rol', "");
      localStorage.setItem('nombreDelUsuario', "");
    });
    this.router.navigate(['']);
  }

  constructor(private http: HttpClient, private router: Router){
    /*this.user.set(String(localStorage.getItem('user')));
    this.pass.set(String(localStorage.getItem('pass')));*/
  }
}

import { Component, signal } from '@angular/core';
import {Usuarios} from '../../../Model/Usuarios'
import {JsonPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  public Titulo = 'Administracion de Usuarios'
  public Usuarios = signal<Usuarios[]>([]);

  constructor(private http: HttpClient){
    this.metodoGetUsuarios();
  }

  public metodoGetUsuarios(){
    let cuerpo = {};
    this.http.get('http://localhost/usuarios', cuerpo).subscribe((Usuarios) =>{
      const arr = Usuarios as Usuarios[];
      arr.forEach((Usuarios)=>{
        this.agregarUsuarioASenial(
          Usuarios.nombreDelUsuario,
          Usuarios.usuariosID,
          Usuarios.claveDelUsuario,
          Usuarios.FechaDeCreacion,
          Usuarios.ActualizadoEn
        )
      })
    })
  }

  public agregarUsuarioASenial(
    nombreDelUsuario: string,
    usuariosID?: Number,
    claveDelUsuario?: string,
    FechaDeCreacion?: Date,
    ActualizadoEn?: Date
  ){
    let nuevoUsuario ={
      usuariosID: usuariosID,
      nombreDelUsuario: nombreDelUsuario,
      claveDelUsuario: claveDelUsuario,
      FechaDeCreacion: FechaDeCreacion,
      ActualizadoEn: ActualizadoEn
    };
    this.Usuarios.update((Usuarios)=>[...Usuarios,nuevoUsuario]);
  }

  public agregarUsuario(event: Event) {
    let tag = event.target as HTMLInputElement;
    let cuerpo = {
      nombreDelUsuario: tag.value,
    };
    this.http.post('http://localhost/usuarios', cuerpo).subscribe(() => {
      this.Usuarios.update((Usuarios) => [...Usuarios, cuerpo]);
    });
  }

  public modificarUsuario(Id: any, event: Event) {
    let tag = event.target as HTMLInputElement;
    let cuerpo = {
      Usuario: tag.value,
    };
    this.http.put('http://localhost/usuarios/' + Id, cuerpo).subscribe(() => {
      this.Usuarios.update((Usuarios) => {
        return Usuarios.map((Usuario) => {
          if (Usuario.usuariosID === Id) {
            return { ...Usuario, Usuario: tag.value };
          }
          return Usuario;
        });
      });
    });
  }

  public borrarUsuario(Id: any) {
    console.log(Id);
    this.http.delete('http://localhost/usuarios/' + Id).subscribe(() => {
      this.Usuarios.update((Usuarios) =>
        Usuarios.filter((Usuario) => Usuario.usuariosID !== Id)
      );
    });
  }

}
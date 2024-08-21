import { Component, signal } from '@angular/core';
import {  Solicitantes } from "../../../Model/Solicitantes"
import {JsonPipe} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-solicitantes',
  standalone: true,
  imports: [JsonPipe,FormsModule],
  templateUrl: './solicitantes.component.html',
  styleUrl: './solicitantes.component.css'
})
export class SolicitantesComponent {
  public Titulo = 'Administracion de Solicitamtes';
  public solicitantesId: Number = 0;
  public nombreDelSolicitante: string = '';
  public telefonoDelSolicitante: string = '';
  public correoDelSolicitante: string = '';
  public claveDelSolicitante: string = '';
  public gSolicitantes = signal<Solicitantes[]>([]);

  constructor(private http: HttpClient, private router: Router) {
    if(!false){
      this.router.navigate(['login']);
    }
    else{
      this.metodoGetSolicitante();
    }

  }

  printInputs() {
    console.log(
      'Info: ' +
        this.solicitantesId +
        '\n' +
        this.nombreDelSolicitante +
        '\n' +
        this.telefonoDelSolicitante +
        '\n' +
        this.correoDelSolicitante +
        '\n' +
        this.claveDelSolicitante
    );
  }

  public metodoGetSolicitante() {
    let cuerpo = {};
    this.http.get('http://localhost/solicitantes', cuerpo).subscribe((xSolicitantes) => {
      const arr = xSolicitantes as Solicitantes[];
      arr.forEach((Solicitante) => {
        this.agregarSolicitanteASenial(
          Solicitante.nombreDelSolicitante,
          Solicitante.solicitantesId,
          Solicitante.telefonoDelSolicitante,
          Solicitante.correoDelSolicitante,
          Solicitante.claveDelSolicitante
        );
      });
    });
  }

  public agregarSolicitanteASenial(
    nombreDelSolicitante: string,
    solicitantesId?: Number,
    telefonoDelSolicitante?: string,
    correoDelSolicitante?: string,
    claveDelSolicitante?: string
  ) {
    let nuevoSolicitante = {
    nombreDelSolicitante: nombreDelSolicitante,
    solicitantesId: solicitantesId,
    telefonoDelSolicitante: telefonoDelSolicitante,
    correoDelSolicitante: correoDelSolicitante,
    claveDelSolicitante: claveDelSolicitante
    };
    this.gSolicitantes.update((pSolicitante) => [...pSolicitante, nuevoSolicitante]);
  }

  public agregarSolicitante(event: Event) {
    let cuerpo = {
      nombreDelSolicitante: this.nombreDelSolicitante,
      telefonoDelSolicitante: this.telefonoDelSolicitante,
      correoDelSolicitante: this.correoDelSolicitante,
      claveDelSolicitante: this.claveDelSolicitante,
    };
    this.http.post('http://localhost/solicitantes', cuerpo).subscribe(() => {
      this.gSolicitantes.update((Solicitantes) => [...Solicitantes, cuerpo]);
    });
  }

  public modificarSolicitante(Id: any, event: Event) {
    let tag = event.target as HTMLInputElement;
    let cuerpo = {
      Solicitante: tag.value,
    };
    this.http.put('http://localhost/solicitantes/' + Id, cuerpo).subscribe(() => {
      this.gSolicitantes.update((lSolicitante) => {
        return lSolicitante.map((xSolicitante) => {
          if (xSolicitante.solicitantesId === Id) {
            return { ...xSolicitante, Servicios: tag.value };
          }
          return xSolicitante;
        });
      });
    });
  }

  public borrarSolicitante(Id: any) {
    console.log(Id);
    this.http.delete('http://localhost/solicitantes/' + Id).subscribe(() => {
      this.gSolicitantes.update((bSolicitante) =>
        bSolicitante.filter((rSolicitante) => rSolicitante.solicitantesId !== Id)
      );
    });
  }
}

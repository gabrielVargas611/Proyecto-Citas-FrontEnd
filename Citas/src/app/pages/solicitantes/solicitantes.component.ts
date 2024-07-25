import { Component, signal } from '@angular/core';
import {  Solicitantes } from "../../../Model/Solicitantes"
import {JsonPipe} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-solicitantes',
  standalone: true,
  imports: [JsonPipe,FormsModule],
  templateUrl: './solicitantes.component.html',
  styleUrl: './solicitantes.component.css'
})
export class SolicitantesComponent {
  public Titulo = 'Administracion de Solicitamtes';
  public xSolicitanteId: Number = 0;
  public xnombreDelSolicitante: string = '';
  public xTelefonoDelSolicitante: string = '';
  public xCorreoDelSOlicitante: string = '';
  public xClaveDelSolicitante: string = '';
  public gSolicitantes = signal<Solicitantes[]>([]);

  constructor(private http: HttpClient) {
    this.metodoGetSolicitante();
  }

  printInputs() {
    console.log(
      'Info: ' +
        this.xSolicitanteId +
        '\n' +
        this.xnombreDelSolicitante +
        '\n' +
        this.xTelefonoDelSolicitante +
        '\n' +
        this.xCorreoDelSOlicitante +
        '\n' +
        this.xClaveDelSolicitante
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
   /* let tag = event.target as HTMLInputElement;
    let cuerpo = {
      sevicioId: tag.value,
      nombreDelServicio: tag.value,
      descripcionDelServicio: tag.value,
      telefonoDeContacto: tag.value,
      correoDeContato: tag.value,
      nombreDelExperto: tag.value
    };
    this.http.post('http://localhost/servicios', cuerpo).subscribe(() => {
      this.gServicios.update((Servicios) => [...Servicios, cuerpo]);
    });*/
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

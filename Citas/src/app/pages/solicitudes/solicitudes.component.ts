import { Component, signal } from '@angular/core';
import {  Solicitudes } from "../../../Model/Solicitudes"
import {JsonPipe} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [JsonPipe,FormsModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css'
})
export class SolicitudesComponent {
  public Titulo = 'Administracion de Solicitudes';
  public descripcionDeSolicitid: string = '';
  public solicitudesId?: Number = 0;
  public fechaSolicitud?: Date = new Date();
  public IdDelservicio?: Number = 0;
  public IdDelsolicitante?: Number = 0;
  public gSolicitudes = signal<Solicitudes[]>([]);

  constructor(private http: HttpClient, private router: Router) {
    if(!true){
      this.router.navigate(['login']);
    }
    else{
      this.metodoGetSolicitud();
    }

  }

  printInputs() {
    console.log(
      'Info: ' +
        this.solicitudesId +
        '\n' +
        this.descripcionDeSolicitid +
        '\n' +
        this.fechaSolicitud +
        '\n' +
        this.IdDelservicio +
        '\n' +
        this.IdDelsolicitante
    );
  }

  public agregarSolicitudASenial(
    descripcionDeSolicitid: string,
    solicitudesId?: Number,
    fechaSolicitud?: Date,
    IdDelservicio?: Number,
    IdDelsolicitante?: Number
  ) {
    let nuevaSolicitud = {
      descripcionDeSolicitid: descripcionDeSolicitid,
      solicitudesId: solicitudesId,
      fechaSolicitud: fechaSolicitud,
      IdDelservicio: IdDelservicio,
      IdDelsolicitante: IdDelsolicitante
    };
    this.gSolicitudes.update((Solicitudes) => [...Solicitudes, nuevaSolicitud]);
  }

  public metodoGetSolicitud() {
    let cuerpo = {};
    this.http.get('http://localhost/solicitudes', cuerpo).subscribe((Solicitudes) => {
      const arr = Solicitudes as Solicitudes[];
      arr.forEach((Solicitudes) => {
        this.agregarSolicitudASenial(
          Solicitudes.descripcionDeSolicitid,
          Solicitudes.solicitudesId,
          Solicitudes.fechaSolicitud,
          Solicitudes.IdDelservicio,
          Solicitudes.IdDelsolicitante
        );
      });
    });
  }

  public agregarSolicitud(event: Event) {
    let cuerpo = {
      solicitudesID: this.solicitudesId,
      descripcionDeSolicitid: this.descripcionDeSolicitid,
      fechaSolicitud: this.fechaSolicitud,
      IdDelservicio: this.IdDelservicio,
      IdDelsolicitante: this.IdDelsolicitante,
    };
    this.http.post('http://localhost/solicitudes', cuerpo).subscribe(() => {
      this.gSolicitudes.update((Solicitudes) => [...Solicitudes, cuerpo]);
    });
    this.printInputs();
  }

  public modificarSolicitud(Id: any, event: Event) {
    let tag = event.target as HTMLInputElement;
    let cuerpo = {
      Solicitud: tag.value,
    };
    this.http.put('http://localhost/solicitudes/' + Id, cuerpo).subscribe(() => {
      this.gSolicitudes.update((lSolicitud) => {
        return lSolicitud.map((Solicitud) => {
          if (Solicitud.solicitudesId === Id) {
            return { ...Solicitud, Servicios: tag.value };
          }
          return Solicitud;
        });
      });
    });
    this.printInputs();
  }

  public modificarSolicitud2(Id: any, event: Event) {
    let cuerpo = {
      solicitudesID: this.solicitudesId,
      descripcionDeSolicitid: this.descripcionDeSolicitid,
      fechaSolicitud: this.fechaSolicitud,
      IdDelservicio: this.IdDelservicio,
      IdDelsolicitante: this.IdDelsolicitante,
    };
    this.http.put('http://localhost/solicitudes/', cuerpo).subscribe(() => {
      this.gSolicitudes.update((Solicitudes) => [...Solicitudes, cuerpo]);
    });
    this.printInputs();
    window.location.reload();
  }

  public borrarSolicitud(Id: any) {
    console.log(Id);
    this.http.delete('http://localhost/solicitudes/' + Id).subscribe(() => {
      this.gSolicitudes.update((Solicitudes) =>
        Solicitudes.filter((rSOlicitudes) => rSOlicitudes.solicitudesId !== Id)
      );
    });
  }
}

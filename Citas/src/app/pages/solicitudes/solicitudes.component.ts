import { Component, signal } from '@angular/core';
import {  Solicitudes } from "../../../Model/Solicitudes"
import {JsonPipe} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {jsPDF} from 'jspdf';

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
    if(!false){
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
            return { ...Solicitud, Solicitud: tag.value };
          }
          return Solicitud;
        });
      });
    });
    this.printInputs();
  }

  public modificar2(Id: any,event: Event) {
    let cuerpo = {
      solicitudesID: this.solicitudesId,
      descripcionDeSolicitid: this.descripcionDeSolicitid,
      fechaSolicitud: this.fechaSolicitud,
      IdDelservicio: this.IdDelservicio,
      IdDelsolicitante: this.IdDelsolicitante,
    };
    this.http.put('http://localhost/solicitudes/'+ Id, cuerpo).subscribe(() => {
      this.gSolicitudes.update((Solicitudes) => {
        return Solicitudes.map((Solicitud) => {
          if (Solicitud.solicitudesId === Id) {
            console.log(cuerpo);
            return { ...Solicitud, cuerpo };
          }
          return Solicitud;
        });
      });
    });
    this.printInputs();
  }

  public buscar(Id: any) {
    this.http.get('http://localhost/solicitudes/' + Id).subscribe((Solicitud) => {
      const arr = Solicitud as Solicitudes[];
      arr.forEach((Solicitudes) => {
         this.descripcionDeSolicitid= Solicitudes.descripcionDeSolicitid,
          this.solicitudesId=Solicitudes.solicitudesId,
          this.fechaSolicitud=Solicitudes.fechaSolicitud,
          this.IdDelservicio=Solicitudes.IdDelservicio,
         this.IdDelsolicitante= Solicitudes.IdDelsolicitante
      });
    });
    this.printInputs();
  }

  public borrarSolicitud(Id: any) {
    console.log(Id);
    this.http.delete('http://localhost/solicitudes/' + Id).subscribe(() => {
      this.gSolicitudes.update((Solicitudes) =>
        Solicitudes.filter((rSOlicitudes) => rSOlicitudes.solicitudesId !== Id)
      );
    });
  }

  public SolicitudesReporte(){
    const doc = new jsPDF();

    const Solicitud = [
      { Name: "SolicitudID", value: this.solicitudesId },
      { Name: "Descripcion", value: this.descripcionDeSolicitid },
      { Name: "Fecha", value: this.fechaSolicitud },
      { Name: "Servicio", value: this.IdDelservicio },
      { Name: "Solicitante", value: this.IdDelsolicitante },
    ];

    // Encabezado
    doc.setFontSize(16);
    doc.text("Reporte de Solicitud", 10, 10);
    doc.setFontSize(12);
    doc.text("Fecha: " + new Date().toLocaleDateString(), 10, 20);

    // Tabla de citas
    let startY = 30;
    Solicitud.forEach((value) => {
        if (startY > 280) { // Si la página está llena, crear una nueva
            doc.addPage();
            startY = 20;
        }
        doc.text(`Solicitud ${value}`, 10, startY);
        doc.text(`Descripcion: ${value}`, 10, startY + 10);
        doc.text(`Fecha: ${value}`, 10, startY + 20);
        doc.text(`Servicio: ${value}`, 10, startY + 30);
        doc.text(`Solicitante: ${value}`, 10, startY + 30);
        startY += 40;
    });

    // Guardar el documento
    doc.save("Solicitudes.pdf");
  }
}

import { Component, signal } from '@angular/core';
import {Servicios} from '../../../Model/Servicios';
import {JsonPipe} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [JsonPipe, FormsModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  public Titulo = 'Administracion de Servicios';
  public xServiciosId: Number = 0;
  public xnombreDelServicio: string = '';
  public xDescripcionDelServicio: string = '';
  public xTelefonoDeContacto: string = '';
  public xCorreoDeContacto: string = '';
  public xNombreDelExperto: string = '';
  public gServicios = signal<Servicios[]>([]);

  constructor(private http: HttpClient) {
    this.metodoGetServicios();
  }

  printInputs() {
    console.log(
      'Info: ' +
        this.xServiciosId +
        '\n' +
        this.xnombreDelServicio +
        '\n' +
        this.xDescripcionDelServicio +
        '\n' +
        this.xTelefonoDeContacto +
        '\n' +
        this.xCorreoDeContacto +
        '\n' +
        this.xNombreDelExperto
    );
  }

  public metodoGetServicios() {
    let cuerpo = {};
    this.http.get('http://localhost/servicios', cuerpo).subscribe((xServicios) => {
      const arr = xServicios as Servicios[];
      arr.forEach((Servicios) => {
        this.agregarServicioASenial(
          Servicios.nombreDelServicio,
          Servicios.serviciosId,
          Servicios.descripcionDelServicio,
          Servicios.correoDeContacto,
          Servicios.telefonoDeContacto,
          Servicios.nombreDelExperto
        );
      });
    });
  }

  public agregarServicioASenial(
    nombreDelServicio: string,
    serviciosId?: Number,
    descripcionDelServicio?: string,
    correoDeContacto?: string,
    telefonoDeContacto?: string,
    nombreDelExperto?: string
  ) {
    let nuevoServicio = {
      sevicioId: serviciosId,
      nombreDelServicio: nombreDelServicio,
      descripcionDelServicio: descripcionDelServicio,
      correoDeContato: correoDeContacto,
      telefonoDeContacto: telefonoDeContacto,
      nombreDelExperto: nombreDelExperto
    };
    this.gServicios.update((pServicios) => [...pServicios, nuevoServicio]);
  }

  public agregarServicio(event: Event) {
    let tag = event.target as HTMLInputElement;
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
    });
  }

  public modificarServicio(Id: any, event: Event) {
    let tag = event.target as HTMLInputElement;
    let cuerpo = {
      Servicio: tag.value,
    };
    this.http.put('http://localhost/servicios/' + Id, cuerpo).subscribe(() => {
      this.gServicios.update((lServicios) => {
        return lServicios.map((xServicio) => {
          if (xServicio.serviciosId === Id) {
            return { ...xServicio, Servicios: tag.value };
          }
          return xServicio;
        });
      });
    });
  }

  public borrarServicio(Id: any) {
    console.log(Id);
    this.http.delete('http://localhost/servicios/' + Id).subscribe(() => {
      this.gServicios.update((bServicio) =>
        bServicio.filter((rServicio) => rServicio.serviciosId !== Id)
      );
    });
  }
}

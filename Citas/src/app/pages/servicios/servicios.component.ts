import { Component, signal } from '@angular/core';
import {Servicios} from '../../../Model/Servicios';
import {JsonPipe} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {jsPDF} from 'jspdf';


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
  //public Fecha: string='';
  public gServicios = signal<Servicios[]>([]);

  constructor(private http: HttpClient,private router: Router) {
    if(!false){
      this.router.navigate(['login']);
    }
    else{
      this.metodoGetServicios();
    }
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
    nombreDelServicio?: string,
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
      servicioId: this.xServiciosId,
      nombreDelServicio: this.xnombreDelServicio,
      descripcionDelServicio: this.xDescripcionDelServicio,
      telefonoDeContacto: this.xTelefonoDeContacto,
      correoDeContato: this.xCorreoDeContacto,
      nombreDelExperto: this.xNombreDelExperto
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

public generarPDF(){
  const doc = new jsPDF();
  let Fecha : String= "";
  const appointments = [
    { date: "2024-08-15", time: "10:00 AM", client: "Cliente 1" },
    { date: "2024-08-16", time: "11:00 AM", client: "Cliente 2" },
    { date: "2024-08-17", time: "02:00 PM", client: "Cliente 3" },
  ];
  // Encabezado
  doc.setFontSize(25);
  doc.text("Calendarización de Citas", 10, 10);
  doc.setFontSize(12);
  doc.text("Fecha: " + new Date().toLocaleDateString(), 10, 20);
  // Tabla de citas
  let startY = 30;
  appointments.forEach((appointment,index)=>{
    if (startY > 280) { // Si la página está llena, crear una nueva
      doc.addPage();
      startY = 20;
  }
  doc.text(`Cita ${index + 1}`, 10, startY);
  doc.text(`Fecha: ${appointment.date}`, 10, startY + 10);
  doc.text(`Hora: ${appointment.time}`, 10, startY + 20);
  doc.text(`Cliente: ${appointment.client}`, 10, startY + 30);
  startY += 40;
  });
    // Guardar el documento
    doc.save("calendarizacion.pdf");
}
  
}

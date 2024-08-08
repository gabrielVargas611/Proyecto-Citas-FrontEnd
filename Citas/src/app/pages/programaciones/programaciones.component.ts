import { Component, signal } from '@angular/core';
import { Programaciones } from '../../../Model/Programaciones';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programaciones',
  standalone: true,
  imports: [JsonPipe, FormsModule],
  templateUrl: './programaciones.component.html',
  styleUrl: './programaciones.component.css',
})
export class ProgramacionesComponent {
  public Titulo = 'Administracion de Programaciones';
  public xProgramacionesId: Number = 0;
  public xFechaInicioDisponible: Date = new Date;
  public xFechaFinalDisponible: Date = new Date;
  public xIdDelServicio: Number = 0;
  public gProgramaciones = signal<Programaciones[]>([]);

  constructor(private http: HttpClient, private router: Router) {
    if(!true){
      this.router.navigate(['login']);
    }
    else{
      this.metodoGetProgramaciones();
      console.log("test");
      this.printInputs();
    }
  }

  printInputs() {
    console.log(
      'Datos: ' +
        this.xProgramacionesId +
        '\n' +
        this.xFechaFinalDisponible +
        '\n' +
        this.xFechaFinalDisponible +
        '\n' +
        this.xIdDelServicio
    );
  }

  public metodoGetProgramaciones() {
    let cuerpo = {};
    this.http.get('http://localhost/programaciones', cuerpo).subscribe((xProgramaciones) => {
        const arr = xProgramaciones as Programaciones[];
        arr.forEach((Programaciones) => {
          this.agregarProgramacionASenial(
            Programaciones.IdDelServicio,
            Programaciones.ProgramacionesId,
            Programaciones.FechaInicioDisponible,
            Programaciones.FechaFinalDisponible
          );
        });
      });
  }

  public agregarProgramacionASenial(
    IdDelServicio: Number,
    ProgramacionesId: Number,
    FechaInicioDisponible?: Date,
    FechaFinalDisponible?: Date,
  ) {
    let nuevaProgramacion = {
      IdDelServicio: IdDelServicio,
      ProgramacionesId: ProgramacionesId,
      FechaInicioDisponible: FechaInicioDisponible,
      FechaFinalDisponible: FechaFinalDisponible
    };
    this.gProgramaciones.update((pProgramaciones) => [...pProgramaciones, nuevaProgramacion]);
  }

  public agregarProgramacion(event: Event) {
    let tag = event.target as HTMLInputElement;
    let cuerpo = {
      IdDelServicio: this.xIdDelServicio,
      ProgramacionesId: this.xProgramacionesId,
      FechaInicioDisponible: this.xFechaInicioDisponible,
      FechaFinalDisponible: this.xFechaFinalDisponible
    };
    this.http.post('http://localhost/programaciones', cuerpo).subscribe(() => {
      this.gProgramaciones.update((Programacion) => [...Programacion, cuerpo]);
    });
  }

  public modificarProgramacion(Id: any, event: Event) {
    let tag = event.target as HTMLInputElement;
    let cuerpo = {
      Programacion: tag.value,
    };
    this.http.put('http://localhost/programaciones/' + Id, cuerpo).subscribe(() => {
      this.gProgramaciones.update((lProgramaciones) => {
        return lProgramaciones.map((xProgramacion) => {
          if (xProgramacion.ProgramacionesId === Id) {
            return { ...xProgramacion, Servicios: tag.value };
          }
          return xProgramacion;
        });
      });
    });
  }

  public borrarProgramacion(Id: any) {
    console.log(Id);
    this.http.delete('http://localhost/programaciones/' + Id).subscribe(() => {
      this.gProgramaciones.update((bProgramaciones) =>
        bProgramaciones.filter((rProgramaciones) => rProgramaciones.ProgramacionesId !== Id)
      );
    });
  }
}

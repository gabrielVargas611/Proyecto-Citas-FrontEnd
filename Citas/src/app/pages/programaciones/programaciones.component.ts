import { Component, signal } from '@angular/core';
import {Programaciones} from '../../../Model/Programaciones';
import {JsonPipe} from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-programaciones',
  standalone: true,
  imports: [JsonPipe, FormsModule],
  templateUrl: './programaciones.component.html',
  styleUrl: './programaciones.component.css'
})
export class ProgramacionesComponent {
  public Titulo = 'Administracion de Programaciones';
  public xProgramacionesId: number =0;
  public xFechaInicioDisponible: Date = new Date();
  public xFechaFinalDisponible: Date = new Date();
  public xIdDelServicio: number = 0;

  public Programaciones = signal<Programaciones[]>([]);

  constructor(private http:HttpClient){

  }

  public metodoGetProgramaciones(){
    let cuerpo = {};
    this.http.get('http://localhost/programaciones', cuerpo).subscribe((Programaciones) => {
      const arr = Programaciones as Programaciones[];
      arr.forEach((Programaciones) => {
        this.agregarProgramacionASenial(
          Programaciones.IdDelServicio,
          Programaciones.FechaInicioDisponible,
          Programaciones.FechaFinalDisponible,
          Programaciones.ProgramacionesId,
          Programaciones.FechaDeCreacion,
          Programaciones.ActualizadoEn
        );
      });
    });
  }

  public agregarProgramacionASenial(IdDelServicio:number,FechaInicioDisponible:Date,FechaFinalDisponible:Date,
    ProgramacionesId?:number,FechaDeCreacion?:Date,ActualizadoEn?:Date
  ){
    let nuevaProgramacion ={
      IdDelServicio: IdDelServicio,
      FechaInicioDisponible: FechaInicioDisponible,
      FechaFinalDisponible: FechaFinalDisponible,
      ProgramacionesId: ProgramacionesId,
      FechaDeCreacion: FechaDeCreacion,
      ActualizadoEn: ActualizadoEn
    };
    //this.Programaciones.update((Programaciones)=>[...Programacion, nuevaProgramacion])
  }
}
import { Component, signal } from '@angular/core';
import {Programaciones} from '../../../Model/Programaciones';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-programaciones',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './programaciones.component.html',
  styleUrl: './programaciones.component.css'
})
export class ProgramacionesComponent {
  public Titulo = 'Administracion de Programaciones'
  public Programaciones = signal<Programaciones[]>([
    {
      ProgramacionesId: 'test',
      FechaInicioDisponible: 'test',
      fechaFinalDisponible: 'test',
      IdDelServicio: 'test',
      FechaDeCreacion: 'test',
      ActualizadoEn: 'test'
    }
  ]);
}
import { Routes } from '@angular/router';
import { ProgramacionesComponent } from './pages/programaciones/programaciones.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { SolicitantesComponent } from './pages/solicitantes/solicitantes.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import {LoginComponent} from './pages/login/login.component';

export const routes: Routes = [
    {
        path: 'programaciones',
        component: ProgramacionesComponent
    },
    {
        path: 'servicios',
        component: ServiciosComponent
    },
    {
        path: 'solicitantes',
        component: SolicitantesComponent
    },
    {
        path: 'solicitudes',
        component: SolicitudesComponent
    },
    {
        path: 'usuarios',
        component: UsuariosComponent
    },
    {
        path: 'login',
        component: LoginComponent
    }
];

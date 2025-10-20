import { Routes } from '@angular/router';
import { MainComponent } from './main/main/main.component';
import { ToolComponent } from './features/tools/tool.component';

export const routes: Routes = [
    {
        path: '', component: MainComponent, children: [
            { path: 'tool', component: ToolComponent }
            // Rutas hijas para los componentes dentro del Sidebar
            /*{ path: 'tools', component: UnidadesComponent },
            { path: 'mantenimiento-servicios', component: MantenimientoServiciosComponent },
            { path: 'conductores', component: ConductoresComponent },
            { path: '', redirectTo: 'unidades', pathMatch: 'full' }*/
        ]
    },
    {
        path: '**', redirectTo: 'home', pathMatch: 'full'
    }
];

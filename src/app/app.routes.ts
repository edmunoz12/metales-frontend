import { Routes } from '@angular/router';
import { MainComponent } from './main/main/main.component';
import { ToolComponent } from './features/tools/tool.component';
import { HomeComponent } from './features/dashboard/home.component';
import { ToolsWearReportComponent } from './features/tools-wear-report/tools-wear-report.component';


export const routes: Routes = [
    {
        path: '', 
            component: MainComponent, 
            children: [
            { path: '', component: HomeComponent },
            { path: 'tool', component: ToolComponent },
            { path: 'tools-wear-report', component: ToolsWearReportComponent }
            // Rutas hijas para los componentes dentro del Sidebar
            /*{ path: 'tools', component: UnidadesComponent },
            { path: 'mantenimiento-servicios', component: MantenimientoServiciosComponent },
            { path: 'conductores', component: ConductoresComponent },
            { path: '', redirectTo: 'unidades', pathMatch: 'full' }*/
        ]
    },
    {
        path: '**', redirectTo: '', pathMatch: 'full'
    }
];

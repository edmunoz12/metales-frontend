import { Routes } from '@angular/router';
import { MainComponent } from './main/main/main.component';
import { ToolComponent } from './features/tools/tool.component';
import { HomeComponent } from './features/dashboard/home.component';
import { ToolsWearReportComponent } from './features/tools-wear-report/tools-wear-report.component';
import { InsertionComponent } from './features/insertion/insertion.component';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AssemblyElectricosComponent } from './features/electricos/assembly-electricos.component';


export const routes: Routes = [
    // Rutas públicas
  { path: 'login', component: LoginComponent },

  // Rutas protegidas (requieren token)
  //login() ahora navega a / que carga MainComponent con HomeComponent por defecto.
  {
    path: '',
    component: MainComponent,
    canActivate: [authGuard], // protege todas las rutas hijas
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },  // Redirige '' a 'home'
      { path: 'home', component: HomeComponent },
      { path: 'tool', component: ToolComponent },
      { path: 'tools-wear-report', component: ToolsWearReportComponent },
      { path: 'insertion', component: InsertionComponent },
      { path: 'assembly', component: AssemblyElectricosComponent },

    ],
  },  
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

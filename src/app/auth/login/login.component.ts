import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
  this.errorMessage = '';
  this.loading = true;

  // Paso 1: obtener cookie CSRF (fuera de /api)
  /**
   *    //this.http.get(`${this.authService.apiUrl.replace('/api', '')}/sanctum/csrf-cookie`, { withCredentials: true })
        this.authService.getCsrfToken() 
   */
  this.http.get(`${this.authService.apiUrl.replace('/api', '')}/sanctum/csrf-cookie`, { withCredentials: true })
    .subscribe({
      next: () => {
        // Paso 2: intentar login
        this.authService.login(this.email, this.password).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.loading = false;
            console.error('Error login:', err);
            this.errorMessage = err.error?.message || 'Credenciales incorrectas.';
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error CSRF:', err);
        this.errorMessage = 'No se pudo establecer la cookie CSRF.';
      }
    });
}

}
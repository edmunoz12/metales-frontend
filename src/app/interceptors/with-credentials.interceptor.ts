import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const withCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Clonamos la request para incluir las cookies
  const clonedRequest = req.clone({
    withCredentials: true // Permite enviar las cookies de Sanctum
  });

  return next(clonedRequest).pipe(
    catchError(error => {
      // Si la sesión expiró o no está autorizada, redirige al login
      if (error.status === 401) {
        console.warn('Sesión expirada o no autorizada.');
        router.navigate(['/login']);
      }

      // Devuelve el error para manejo adicional
      return throwError(() => error);
    })
  );
};
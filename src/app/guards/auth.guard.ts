import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';
//import { HttpClient } from '@angular/common/http';
//import { isPlatformBrowser } from '@angular/common';

/**
 * AuthGuard — protege rutas verificando sesión con Laravel Sanctum.
 * Si no hay sesión activa, redirige al login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  //const http = inject(HttpClient);
  //const loader = inject(LoaderService);

  // Si ya hay usuario cargado localmente, permite el acceso
  if (authService.isAuthenticated()) {
    return of(true);
  }
 
  // Si no hay usuario en memoria, validamos con el backend (cookie Sanctum)
  /*
  return http.get(`${authService['apiUrl']}/user`, { withCredentials: true }).pipe(
    map((user: any) => {
      if (user) {
        // Restauramos el usuario en AuthService
        //(authService as any).currentUser = user;
        (authService as any).currentUserSubject.next(user);
        if (isPlatformBrowser(authService['platformId'])) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        return true;
      }
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );

  */

  return authService.fetchUser().pipe(
    map((user) => {
      if (user) {
        return true; // Usuario autenticado → permitir acceso
      }
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );


};

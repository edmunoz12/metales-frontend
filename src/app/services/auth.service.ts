import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: number;
  name: string;
  email: string;
  user_type_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost/metales/public/api';

  // Estado del usuario actual (reactivo)
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }
 
  /** Obtener CSRF cookie de Sanctum */
  getCsrfToken(): Observable<any> {
    return this.http.get(`${this.apiUrl.replace('/api', '')}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
  }

  /** Inicia sesión */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, {
      withCredentials: true  // NECESARIO
    }).pipe(
      tap(response => {
        /*if (isPlatformBrowser(this.platformId)) {
          
         if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }*/

        if (response.user && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        this.currentUserSubject.next(response.user);
      }),
      catchError(err => throwError(() => err))
    );
  }

  /** Cierra sesión */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true  // NECESARIO
    }).pipe(
      tap(() => { 
       if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('user');
        }
        this.currentUserSubject.next(null);
      }),
      catchError(err => throwError(() => err))
    );
  }

  /** Obtener usuario autenticado */
  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`, {
      withCredentials: true  // ⚠️ NECESARIO
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  /** Obtener usuario autenticado desde backend */
  fetchUser(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/user`, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      }),
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  isAuthenticated(): boolean {
    //return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
    return !!this.currentUserSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  

}
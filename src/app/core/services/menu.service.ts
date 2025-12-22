import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  //private api: string = 'http://localhost/metales/public/api/'; 
  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMenu(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/menu`);
    /*
    return this.http.get<any[]>(`${this.api}/menu`, {
      withCredentials: true
    });
    */
  }

  getSubmenu(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}/submenu`);
    /*
    return this.http.get<any[]>(`${this.api}/submenu`, {
      withCredentials: true
    });
    */
  }
}

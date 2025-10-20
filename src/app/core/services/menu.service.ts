import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  //private api: string = 'http://127.0.0.1:8000/metales/public/api/'; 
  private api: string = 'http://localhost/metales/public/api/'; 

  constructor(private http: HttpClient) { }

  getMenu(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}menu`);
  }

  getSubmenu(): Observable<any[]>{
    return this.http.get<any[]>(`${this.api}submenu`);
  }
}

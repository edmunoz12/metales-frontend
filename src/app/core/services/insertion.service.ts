import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Insertion {
  id?: number;
  code: string;
  shape: string;
  station_size: string;
  measurement: string;
  angle: number;
  clarity: string;
  insertion_type_id: number;
  location_id: number;
  supplier_id: number; 
  acquired_at: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InsertionService {

  private apiUrl = 'http://localhost/metales/public/api/insertion';
  private api = 'http://localhost/metales/public/api';

  
  constructor(private http: HttpClient) {}

  getInsertions(
    search: string,
    page: number,
    pageSize: number,
    sortColumn: string,
    sortDirection: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortColumn', sortColumn)
      .set('sortDirection', sortDirection);

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Catálogos dinámicos
  getToolTypes(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.api}/tooTypes`);
  }

  getLocations(): Observable<{ id: number; code: string }[]> {
    return this.http.get<{ id: number; code: string }[]>(`${this.api}/locations`);
  }

  getSuppliers(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.api}/suppliers`);
  }
 
  
}

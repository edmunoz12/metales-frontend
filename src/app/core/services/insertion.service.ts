import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Insertion {
  id?: number;
  code: string;
  tool_type_id: number;
  measurement: string;
  supplier_id: number; 
  model: string;
  style: string;
  location_id: number;
  report_type_id: number; 
  acquired_at: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InsertionService {

  /*  private apiUrl = 'http://localhost/metales/public/api/insertion';
  private api = 'http://localhost/metales/public/api';
  */

  // Base URL from environment
  private api = environment.apiUrl;

  // Resource URL
  private apiUrl = `${this.api}/insertion`;
  
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
    return this.http.get<{ id: number; name: string }[]>(`${this.api}/toolTypes`);
  }

  getLocations(): Observable<{ id: number; code: string }[]> {
    return this.http.get<{ id: number; code: string }[]>(`${this.api}/locations`);
  }
  
  getSuppliers(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.api}/suppliers`);
  }
 
  /**
   * Crear nueva herramienta
   */
  createTool(data: Insertion): Observable<Insertion> {
    return this.http.post<Insertion>(this.apiUrl, data);
  }

  /**
   * Actualizar herramienta existente
   */
  updateTool(id: number, data: any): Observable<any> {
    console.log('method updateTool:',data );
    return this.http.put<Insertion>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Eliminar herramienta
   */
  deleteTool(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
     
}

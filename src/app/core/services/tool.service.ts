import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Tool {
  id?: number;
  code: string;
  shape: string;
  station_size: string;
  measurement: string;
  angle: string;
  clarity: string;
  tool_type_id: number;
  location_id: number;
  supplier_id: number;
  lifecycle_statuses: string;
  acquired_at: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  // URL RESTful base
  private apiUrl = 'http://localhost/metales/public/api/tools';
  private api = 'http://localhost/metales/public/api';

  constructor(private http: HttpClient) {}

  /**
   * Obtener lista paginada, filtrada y ordenada de herramientas
   */
  getTools(
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

  //Catalagos
  getToolTypes(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.api}/tooTypes`);
  }
  getLocations(): Observable<{ id: number; code: string }[]> {
    return this.http.get<{ id: number; code: string }[]>(`${this.api}/locations`);
  }
  getSuppliers(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.api}/suppliers`);
  }

  /* Count Tools */
  getToolCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`).pipe(
      map(res => res.count)
    );
  }

  /**
   * Obtener una herramienta por ID
   */
  getTool(id: number): Observable<Tool> {
    return this.http.get<Tool>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nueva herramienta
   */
  createTool(data: Tool): Observable<Tool> {
    return this.http.post<Tool>(this.apiUrl, data);
  }

  /**
   * Actualizar herramienta existente
   */
  updateTool(id: number, data: any): Observable<any> {
    return this.http.put<Tool>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Eliminar herramienta
   */
  deleteTool(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
   

}

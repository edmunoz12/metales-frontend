import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface ToolWearReport {
  id: number;
  code: string;
  lifecycle_statuses: string;
  tool_type_id: number;
  tool_type_name: string;
  location_id: number;
  location_name: string;
  location_code: string;
  location_description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToolsWearReportService {

  private apiUrl = 'http://localhost/metales/public/api/reports';
  constructor(private http: HttpClient) { }

  getReports(
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

  /**
   * Obtener un reporte específico por ID
   */
  getReport(id: number): Observable<ToolWearReport> {
    return this.http.get<ToolWearReport>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nuevo reporte (si lo manejas como entidad persistente)
   */
  createReport(data: ToolWearReport): Observable<ToolWearReport> {
    return this.http.post<ToolWearReport>(this.apiUrl, data);
  }

  /**
   * Actualizar reporte existente
   */
  updateReport(id: number, data: Partial<ToolWearReport>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Eliminar reporte
   */
  deleteReport(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}

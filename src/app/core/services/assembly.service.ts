import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Assembly {
  id?: number;
  part_number: string;
  quantity: number;
  priority_type: number;
  assembly_date: string;
}

@Injectable({
  providedIn: 'root'
}) 

export class AssemblyService {
  private apiUrl = 'http://localhost/metales/public/api/assemblies';

  constructor(private http: HttpClient) { }

  /**
   * Obtener lista paginada, filtrada y ordenada
   */
  getAssemblies(
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
   * Obtener un ensamble por ID
   */
  getAssembly(id: number): Observable<Assembly> {
    return this.http.get<Assembly>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear nuevo ensamble
   */
  createAssembly(data: Assembly): Observable<Assembly> {
    console.log('createAssembly',data);
    return this.http.post<Assembly>(this.apiUrl, data);
  }

  /**
   * Actualizar ensamble existente
   */
  updateAssembly(id: number, data: any): Observable<any> {
    return this.http.put<Assembly>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Eliminar ensamble
   */
  deleteAssembly(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
     

}

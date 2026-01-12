import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Assembly {
  id?: number;
  part_number: string;
  quantity: number;
  priority_type: number;
  assembly_date: string;
  assembly_customer_id: number;
  user_id: number;
}

@Injectable({
  providedIn: 'root'
})

export class AssemblyService {
  //private apiUrl = 'http://localhost/metales/public/api/assemblies';
  private apiUrl = environment.apiUrl + '/assemblies';

  constructor(private http: HttpClient) { }

  //Catalagos  
  getOperators(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.apiUrl}/operators`);
  }

  getCustomers(): Observable<{ id: number; customer_name: string; logo_path: string }[]> {
    return this.http.get<{ id: number; customer_name: string; logo_path: string }[]>(`${this.apiUrl}/customers`);
  }


  /** 
   *  1.- lista paginada PRODUCCION , filtrada y ordenada por prioridad
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
   * 2.- Assemblies REPORTS lista paginada, filtrada y ordenada (FECHA)
   */
  getAssembliesReports(
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

    return this.http.get<any>(`${this.apiUrl}/reports`, { params });
  }


  /**
   * 1.- lista paginada PRODUCCION Obtener un ensamble por ID
   */
  getAssembly(id: number): Observable<Assembly> {
    return this.http.get<Assembly>(`${this.apiUrl}/${id}`);
  }

  /**
   * 1.- lista paginada PRODUCCION Crear nuevo ensamble
   */
  createAssembly(data: Assembly): Observable<Assembly> {
    console.log('createAssembly', data);
    return this.http.post<Assembly>(this.apiUrl, data);
  }

  /**
   * 1.- lista paginada PRODUCCION Actualizar ensamble existente
   */
  updateAssembly(id: number, data: any): Observable<any> {
    console.log('createAssembly', data);
    return this.http.put<Assembly>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * 1.- lista paginada PRODUCCION Eliminar ensamble
   */
  deleteAssembly(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  completedAssembly(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/complete`, {});
  }

}

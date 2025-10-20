import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  private apiUrl = 'http://localhost/metales/public/api/index';

  constructor(private http: HttpClient) {}

  getTools(search: string, page: number, pageSize: number, sortColumn: string, sortDirection: string) {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortColumn', sortColumn)
      .set('sortDirection', sortDirection);

    return this.http.get<any>(this.apiUrl, { params });
  }

  deleteTool(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}

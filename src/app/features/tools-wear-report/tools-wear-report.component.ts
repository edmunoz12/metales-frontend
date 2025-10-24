import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ToolsWearReportService } from '../../core/services/tools-wear-report.service';

@Component({
  selector: 'app-tools-wear-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './tools-wear-report.component.html',
  styleUrl: './tools-wear-report.component.css'
})
export class ToolsWearReportComponent implements OnInit {

  reportData: any[] = [];
  total: number = 0;
  currentPage = 1;
  pageSize = 20;
  search = '';
  sortColumn = 'code';
  sortDirection = 'asc';

  constructor(private reportService: ToolsWearReportService){}

  ngOnInit(): void {
    this.loadReport();
  }

   // Carga datos del reporte
  loadReport(): void {
    this.reportService.getReports(
      this.search,
      this.currentPage,
      this.pageSize,
      this.sortColumn,
      this.sortDirection
    ).subscribe({
      next: (response: any) => {
        this.reportData = response.data;
        this.total = response.total;
      },
      error: (err) => {
        console.error('Error al cargar reporte:', err);
        //Swal.fire('Error', 'No se pudo cargar el reporte.', 'error');
      }
    });
  }

  // Cambiar página
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadReport();
  }

  // Ordenar columnas
  onSortChange(column: string) {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.loadReport();
  }

  // Búsqueda
  onSearch(search: string) {
    this.search = search;
    this.currentPage = 1;
    this.loadReport();
  }

  // Cambiar cantidad de registros por página
  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.loadReport();
  }

}

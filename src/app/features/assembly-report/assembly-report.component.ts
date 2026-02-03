import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AssemblyService } from '../../core/services/assembly.service';

@Component({
  selector: 'app-assembly-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './assembly-report.component.html',
  styleUrl: './assembly-report.component.css'
})
export class AssemblyReportComponent implements OnInit {
  @ViewChild('assemblyReportModal') assemblyModal: any;


  catalogoAssemblies: any[] = [];
  total: number = 0;
  currentPage = 1;
  pageSize: number = 10;
  search = '';
  sortColumn = 'name';
  sortDirection = 'asc';
  dateFilter = '';

  priorityOptions = [
    { id: 1, name: 'Prioritario' },
    { id: 2, name: 'Normal' },
    { id: 3, name: 'Preferente' }
  ];

  constructor(
    private assemblyService: AssemblyService
  ) { }

  ngOnInit(): void {
    this.assemblies();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.assemblies();
  }

  onSearch(search: string) {
    this.search = search;
    this.currentPage = 1;
    this.assemblies();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.assemblies();
  }

  /*
  get topAssemblies() {
    return this.catalogoAssemblies.slice(0, 8).reverse();
  }
  */

  assemblies(): void {
    this.assemblyService.getAssembliesReports(this.search, this.currentPage, this.pageSize, this.sortColumn, this.sortDirection)
      .subscribe({
        next: (response) => {
          this.catalogoAssemblies = response.data || response;
          this.total = response.total || this.catalogoAssemblies.length;
        },
        error: (err) => {
          console.error('Error al cargar datos:', err);
        }
      });
  }

  /** Funciones */
  exportPDF() {
    alert('Función de exportar PDF (pendiente de implementar)');
  }

  exportExcel() {
    alert('Función de exportar Excel (pendiente de implementar)');
  }

}

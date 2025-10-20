import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ToolService } from '../../core/services/tool.service';

@Component({
  selector: 'app-tool',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.css'
})
export class ToolComponent implements OnInit {
  catalogoTools: any[] = [];
  total: number = 0;
  currentPage = 1;
  pageSize: number = 20;
  search = '';
  sortColumn = 'name';
  sortDirection = 'asc';

  constructor(private toolService: ToolService) {}

  ngOnInit(): void {
    this.loadTools();
  }

  loadTools() {
    this.toolService.getTools(
      this.search,
      this.currentPage,
      this.pageSize,
      this.sortColumn,
      this.sortDirection
    ).subscribe((response) => {
      this.catalogoTools = response.data;
      this.total = response.total;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTools();
  }

  onSortChange(column: string) {
    this.sortColumn = column;
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.loadTools();
  }

  onSearch(search: string) {
    this.search = search;
    this.currentPage = 1;
    this.loadTools();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.loadTools();
  }

  nuevoRegistro() {
    console.log('Nuevo registro de herramienta');
  }

  editarTool(id: number) {
    console.log('Editar herramienta', id);
  }

  eliminarTool(id: number) {
    Swal.fire({
      title: 'Confirmar eliminación',
      text: '¿Quieres eliminar esta herramienta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toolService.deleteTool(id).subscribe(() => {
          Swal.fire('Eliminado', 'La herramienta ha sido eliminada.', 'success');
          this.loadTools();
        });
      }
    });
  }

}

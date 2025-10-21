import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ToolService } from '../../core/services/tool.service';

@Component({
  selector: 'app-tool',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './tool.component.html',
  styleUrl: './tool.component.css'
})
export class ToolComponent implements OnInit {
  @ViewChild('toolModal') toolModal: any;

  catalogoTools: any[] = [];
  total: number = 0;
  currentPage = 1;
  pageSize: number = 20;
  search = '';
  sortColumn = 'name';
  sortDirection = 'asc';

  toolForm!: FormGroup;

  //dropbox
  toolTypes: any[] = [];
  locations: any[] = [];
  suppliers: any[] = [];

  constructor(
    private toolService: ToolService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadTools(); //cargar todos los registros
    this.initForm();

    this.toolService.getToolTypes().subscribe(data => this.toolTypes = data);
    this.toolService.getLocations().subscribe(data => this.locations = data);
    this.toolService.getSuppliers().subscribe(data => this.suppliers = data);
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

  // Nuevo Registro
  // Inicializa formulario
  private initForm(): void {
    this.toolForm = this.fb.group({
      id: [null],
      code: ['', [Validators.required, Validators.maxLength(3)]],
      shape: ['', Validators.required],
      station_size: ['', Validators.required],
      measurement: ['', Validators.required],
      angle: ['', Validators.required],
      clarity: ['', Validators.required],
      tool_type_id: ['', Validators.required],
      location_id: ['', Validators.required],
      supplier_id: ['', Validators.required],
      lifecycle_statuses: ['', Validators.required],
      acquired_at: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  // Cargar herramientas con paginación, búsqueda, etc.
  loadTools(): void {
    this.toolService.getTools(this.search, this.currentPage, this.pageSize, this.sortColumn, this.sortDirection)
      .subscribe({
        next: (response) => {
          this.catalogoTools = response.data || response; // depende cómo responda tu backend
          this.total = response.total || this.catalogoTools.length;
        },
        error: (err) => {
          console.error('Error al cargar herramientas:', err);
          Swal.fire('Error', 'No se pudieron cargar las herramientas.', 'error');
        }
      });
  }

  // Abre el modal para crear nueva herramienta
  newTool(): void {
    this.toolForm.reset();
    this.toolForm.patchValue({ id: null });
    this.modalService.open(this.toolModal, { backdrop: 'static', centered: true });
  }

  // tool.component.ts
  editTool(tool: any) {
  // Cargamos los valores del registro seleccionado en el formulario
  this.toolForm.patchValue(tool);

  // Abrimos el modal de edición
  this.modalService.open(this.toolModal, { backdrop: 'static' });
  }

  // Guarda nueva herramienta
  saveTool(modalRef: any): void {
    if (this.toolForm.invalid) {
      this.toolForm.markAllAsTouched();
      return;
    }

    const formData = this.toolForm.value;

    if (formData.id) {
      // Modo edición (usa PUT)
      this.toolService.updateTool(formData.id, formData).subscribe({
      next: (updatedTool) => {
      Swal.fire({
        icon: 'success',
        title: 'Actualización exitosa',
        text: 'La herramienta fue actualizada correctamente.'
      }).then(() => {
        modalRef.close();
        this.loadTools(); // recarga lista
      });
    },
    error: (error) => {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
    }
  });
    } else {
    // Modo creación
    this.toolService.createTool(formData).subscribe({
      next: (newTool) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro creado',
          text: 'La herramienta fue registrada exitosamente.'
        }).then(() => {
          modalRef.close();
          this.catalogoTools.unshift(newTool);
          this.total++;
        });
      },
      error: (error) => {
        console.error(error);
        Swal.fire('Error', 'No se pudo guardar el registro.', 'error');
      }
    });
  }

    
  }

  // Elimina una herramienta
  deleteTool(toolId: number): void {
    Swal.fire({
      title: '¿Eliminar herramienta?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.toolService.deleteTool(toolId).subscribe({
          next: () => {
            this.catalogoTools = this.catalogoTools.filter(t => t.id !== toolId);
            this.total--;
            Swal.fire('Eliminado', 'La herramienta fue eliminada.', 'success');
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar la herramienta.', 'error');
          }
        });
      }
    });
  }

}

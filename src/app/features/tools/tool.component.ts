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
  ) { }

  ngOnInit(): void {
    this.loadTools(); //cargar todos los registros
    this.initForm();

    // Cargar tipos de herramienta
    this.toolService.getToolTypes().subscribe(data => {
      this.toolTypes = data.map(t => ({
        id: Number(t.id),
        name: t.name
      }));
    });

    // Cargar ubicaciones
    this.toolService.getLocations().subscribe(data => {
      this.locations = data.map(l => ({
        id: Number(l.id), 
        name: l.name
      }));
    });

    // Cargar proveedores
    this.toolService.getSuppliers().subscribe(data => {
      this.suppliers = data.map(s => ({
        id: Number(s.id),
        name: s.name
      }));
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

  // Nuevo Registro
  // Inicializa formulario
  private initForm(): void {
    this.toolForm = this.fb.group({
      id: [null],
      //code: ['', [Validators.required, Validators.maxLength(3)]],
      code: [''],
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
      description: [''],
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
          //Swal.fire('Error', 'No se pudieron cargar las herramientas.', 'error');
        }
      });
  }

  // Abre el modal para crear nueva herramienta
  newTool(): void {
    this.toolForm.reset();
    this.toolForm.patchValue({ id: null });

    /*
    |--------------------------------------------------------------------------
    | 1. PEDIR SIGUIENTE CODE DISPONIBLE
    |--------------------------------------------------------------------------
    */

    this.toolService.getNextCode().subscribe({
      next: (response) => {

        const code = response.data.code;

        this.toolForm.patchValue({ code });

        this.modalService.open(this.toolModal, {
          backdrop: 'static',
          centered: true
        });
      },

      error: (error) => {

        console.error(error);

        Swal.fire(
          'Sin códigos disponibles',
          'No hay códigos disponibles para asignar.',
          'warning'
        );
      }
    });
  }

  // tool.component.ts
  editTool(tool: any): void {
    const formattedTool = {
      id: Number(tool.id),
      code: String(tool.code),
      description: String(tool.description),
      shape: String(tool.shape),
      station_size: String(tool.station_size),
      measurement: String(tool.measurement),
      lifecycle_statuses: Number(tool.lifecycle_statuses),
      angle: Number(tool.angle),
      clarity: String(tool.clarity),
      tool_type_id: tool.tool_type_id ? Number(tool.tool_type_id) : null,
      location_id: tool.location_id ? Number(tool.location_id) : null,
      supplier_id: tool.supplier_id ? Number(tool.supplier_id) : null,
      acquired_at: tool.acquired_at
        ? tool.acquired_at.split('T')[0]  // convierte "2025-10-17T00:00:00.000000Z" → "2025-10-17"
        : ''
    };

    this.toolForm.patchValue(formattedTool);
    this.modalService.open(this.toolModal, { backdrop: 'static' });
  }


  saveTool(modalRef: any): void {
    const formData = this.toolForm.value;

    if (formData.id) {
      // Modo edición (usa PUT)
      this.toolService.updateTool(formData.id, formData).subscribe({
        next: () => {
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
      // code no disponible
      /* */

      // Modo creación
      this.toolService.createTool(formData).subscribe({
        next: (newTool) => {

          Swal.fire({
            icon: 'success',
            title: 'Registro creado',
            html: `<strong>Código asignado:</strong> ${newTool.code}`,
          }).then(() => {

            modalRef.close();

            this.loadTools(); // ← MEJOR que unshift manual
          });
        },

        error: (error) => { 
          console.error(error); 
          Swal.fire(
            'Error',
            error.error?.message ?? 'No se pudo guardar el registro.',
            'error'
          );
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

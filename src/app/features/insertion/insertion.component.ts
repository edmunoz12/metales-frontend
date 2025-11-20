import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { InsertionService } from '../../core/services/insertion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insertion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './insertion.component.html',
  styleUrl: './insertion.component.css'
})
export class InsertionComponent implements OnInit {
  @ViewChild('toolTypeModal') toolTypeModal: any;

  insertions: any[] = [];
  total: number = 0;
  currentPage = 1;
  pageSize: number = 20;
  search = '';
  sortColumn = 'name';
  sortDirection = 'asc';
  
  toolTypeForm!: FormGroup;

  //dropbox
  toolTypes: any[] = []; 
  locations: any[] = [];
  suppliers: any[] = [];
  reportType: any[] = [];

  typeOptions = [
    { id: 2, report_type_name: 'Doblado' },
    { id: 3, report_type_name: 'Inserción' }
  ];

  constructor(
    private insertionService: InsertionService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ){}

  ngOnInit(): void {
    this.loadTools();
    this.initForm();

    // Cargar tipos de herramienta
    this.insertionService.getToolTypes().subscribe(data => {
      this.toolTypes = data.map(t => ({
        id: Number(t.id),
        name: t.name
      }));
    });

    // Cargar ubicaciones
    this.insertionService.getLocations().subscribe(data => {
      this.locations = data.map(l => ({
        id: Number(l.id),
        code: l.code
      }));
    });

    // Cargar proveedores
    this.insertionService.getSuppliers().subscribe(data => {
      this.suppliers = data.map(s => ({
        id: Number(s.id),
        name: s.name
      }));
    });
 
    this.insertionService.getToolTypes().subscribe(data => this.toolTypes = data); 
    this.insertionService.getLocations().subscribe(data => this.locations = data);
    this.insertionService.getSuppliers().subscribe(data => this.suppliers = data);
   
  }

  loadTools(): void {
    this.insertionService.getInsertions(
      this.search,
      this.currentPage,
      this.pageSize,
      this.sortColumn,
      this.sortDirection
    ).subscribe({
      next: (res) => {
        this.insertions = res.data || res;
        this.total = res.total || this.insertions.length;
      },
      error: (err) => {
        console.error('Error al cargar inserciones:', err);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadTools();
  }

  onSortChange(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
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
      this.toolTypeForm = this.fb.group({
        id: [null],
        code: ['', [Validators.required, Validators.maxLength(3)]],
        tool_type_id: ['', Validators.required],
        measurement: ['', Validators.required],
        supplier_id: ['', Validators.required], 
        model: [''],
        style: [''],
        report_type_id: ['',Validators.required], 
        acquired_at: ['', Validators.required],
        description: [''], 
        location_id: ['', Validators.required],
      });
    }

  // Abre el modal para crear nueva herramienta
  newTool(): void {
    this.toolTypeForm.reset();
    this.toolTypeForm.patchValue({ id: null });
    this.modalService.open(this.toolTypeModal, { backdrop: 'static', centered: true });
  }

  editTool(tool: any): void {
    const formattedTool = {
      id: Number(tool.id),
      code: String(tool.code),
      tool_type_id: tool.tool_type_id ? Number(tool.tool_type_id) : null, 
      model: String(tool.model),
      measurement: String(tool.measurement), 
      supplier_id: tool.supplier_id ? Number(tool.supplier_id) : null,
      style: String(tool.style),
      location_id: tool.location_id ? Number(tool.location_id) : null,
      report_type_id: tool.report_type_id ? Number(tool.report_type_id) :null,
      description: tool.description ?  String(tool.description) : null, 

      acquired_at: tool.acquired_at
        ? tool.acquired_at.split('T')[0]  // convierte "2025-10-17T00:00:00.000000Z" → "2025-10-17"
        : ''
    };

    this.toolTypeForm.patchValue(formattedTool);
    this.modalService.open(this.toolTypeModal, { backdrop: 'static' });
  }

   // Guarda nueva herramienta
  saveTool(modalRef: any): void {
    if (this.toolTypeForm.invalid) {
      this.toolTypeForm.markAllAsTouched();
      return;
    }

    const formData = this.toolTypeForm.value;

    if (formData.id) {
      // Modo edición (usa PUT)
      this.insertionService.updateTool(formData.id, formData).subscribe({
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
      // Modo creación
      this.insertionService.createTool(formData).subscribe({
        next: (newTool) => {
          Swal.fire({
            icon: 'success',
            title: 'Registro creado',
            text: 'La herramienta fue registrada exitosamente.'
          }).then(() => {
            modalRef.close();
            this.insertions.unshift(newTool);
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
        this.insertionService.deleteTool(toolId).subscribe({
          next: () => {
            this.insertions = this.insertions.filter(t => t.id !== toolId);
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

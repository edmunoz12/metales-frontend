import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AssemblyService } from '../../core/services/assembly.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assembly-electricos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  templateUrl: './assembly-electricos.component.html',
  styleUrl: './assembly-electricos.component.css'
})
export class AssemblyElectricosComponent implements OnInit {
  @ViewChild('assemblyModal') assemblyModal: any;

  catalogoAssemblies: any[] = [];
  total: number = 0;
  currentPage = 1;
  pageSize: number = 20;
  search = '';
  sortColumn = 'name';
  sortDirection = 'asc';

  assemblyForm!: FormGroup;

  priorityOptions = [
    { id: 1, name: 'Prioritario' },
    { id: 2, name: 'Normal' }
  ];

  constructor(
    private fb: FormBuilder,
    private assemblyService: AssemblyService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.assemblies();
    this.initForm();
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


  get topAssemblies() {
    return this.catalogoAssemblies.slice(0, 8).reverse();
  }

  private initForm(): void {
    this.assemblyForm = this.fb.group({
      id: [null],
      part_number: ['', Validators.required],
      quantity: ['', Validators.required],
      priority_type: ['', Validators.required],
      assembly_date: [''],
    });
  }

  // Cargar datos con paginación, búsqueda, etc.
  assemblies(): void {
    this.assemblyService.getAssemblies(this.search, this.currentPage, this.pageSize, this.sortColumn, this.sortDirection)
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

  newAssembly(): void {
    this.assemblyForm.reset();
    this.assemblyForm.patchValue({ id: null });
    this.modalService.open(this.assemblyModal, { backdrop: 'static', centered: true });
  }


  editAssembly(assembly: any): void {
    const formattedAssembly = {
      id: Number(assembly.id),
      part_number: String(assembly.part_number),
      quantity: Number(assembly.quantity),
      priority_type: Number(assembly.priority_type),  // 1 prioridad  o 2 no prioritario restringido
      assembly_date: assembly.assembly_date
        ? assembly.assembly_date.split('T')[0]        // "2025-10-17T00:00:00.000Z" → "2025-10-17"
        : ''
    };

    // Pone los valores en el formulario
    this.assemblyForm.patchValue(formattedAssembly);
    this.modalService.open(this.assemblyModal, { backdrop: 'static', centered: true });
  }


  saveAssembly(modalRef: any): void {
    if (this.assemblyForm.invalid) {
      this.assemblyForm.markAllAsTouched();
      return;
    }

    const formData = this.assemblyForm.value;

    if (formData.id) {
      this.assemblyService.updateAssembly(formData.id, formData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: 'El registro fue actualizado correctamente.'
          }).then(() => {
            modalRef.close();
            this.assemblies(); // recarga lista
          });
        },
        error: (error) => {
          console.error(error);
          Swal.fire('Error', 'No se pudo actualizar el registro.', 'error');
        }
      });
    } else {
      // Modo creación
      this.assemblyService.createAssembly(formData).subscribe({
        next: (newAssembly) => {
          Swal.fire({
            icon: 'success',
            title: 'Registro creado',
            text: 'Se ha generado el registro exitosamente.'
          }).then(() => {
            modalRef.close();
            this.catalogoAssemblies.unshift(newAssembly);
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


  deleteItem(assemblyId: number): void {
    Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.assemblyService.deleteAssembly(assemblyId).subscribe({
          next: () => {
            this.catalogoAssemblies = this.catalogoAssemblies.filter(a => a.id !== assemblyId);
            this.total--;
            Swal.fire('Eliminado', 'El registro seleccionado fue eliminada.', 'success');
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        });
      }
    });
  }

}

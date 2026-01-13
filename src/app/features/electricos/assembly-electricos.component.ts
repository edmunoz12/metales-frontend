import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AssemblyService } from '../../core/services/assembly.service';
import Swal from 'sweetalert2';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

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
    { id: 1, name: 'Preferente' },
    { id: 2, name: 'Prioritario' },
    { id: 3, name: 'Normal' },

  ];

  //dropbox
  opetators: any[] = [];
  customers: any[] = [];

  user$: Observable<User | null>;

  allowedForNewAssembly = [1, 3, 5]; //" New Assembly"
  allowedForTable = [1, 3, 5, 6]; // tabla
  onlyUserForActions = [1,3]; // "actions" 

  constructor(
    private authService: AuthService,         
    private fb: FormBuilder,
    private assemblyService: AssemblyService,
    private modalService: NgbModal
  ) { 
    this.user$ = this.authService.currentUser$; 
  }

  ngOnInit(): void {
    this.assemblies();
    this.initForm();

    // Catalogo de operadores
    this.assemblyService.getOperators().subscribe(data => {
      this.opetators = data.map(o => ({
        id: Number(o.id),
        name: o.name
      }));
    });

    // Catalogo de clientes 
    this.assemblyService.getCustomers().subscribe(data => {
      this.customers = data.map(c => ({
        id: Number(c.id),
        customer_name: c.customer_name,
        logo_path: c.logo_path
      }));
    });

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
    return this.catalogoAssemblies.slice(0, 5);
  }

  get nextQueue() {
    return this.catalogoAssemblies.slice(5);          
  }

  get currentAssembly() {
    return this.catalogoAssemblies[0] || null;
  }

  private initForm(): void {
    this.assemblyForm = this.fb.group({
      id: [null],
      part_number: ['', Validators.required],
      quantity: ['', Validators.required],
      priority_type: ['', Validators.required],
      assembly_date: [''],
      user_id: [''],
      job:[''],
      assembly_customer_id: [''],
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
      priority_type: Number(assembly.priority_type),
      user_id: Number(assembly.user_id),
      job: String(assembly.job),
      assembly_customer_id: Number(assembly.assembly_customer_id),
      assembly_date: assembly.assembly_date
        ? assembly.assembly_date.split('T')[0]        // "2025-10-17T00:00:00.000Z" → "2025-10-17"
        : '',
      

    };

    // Pone los valores en el formulario
    this.assemblyForm.patchValue(formattedAssembly);
    this.modalService.open(this.assemblyModal, { 
      backdrop: 'static', 
      centered: true,
      size: 'lg',
      windowClass: 'queue-modal'
     });
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
            title: 'El Job '+ formData.job + ' ha sido actualizado con éxito',
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
            this.assemblies();
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

  // update Status 
  updateStatus(assemblyId: number): void {
    Swal.fire({
      title: '¿Marcar como terminado?',
      text: '¿Quieres cambiar el estado de este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.assemblyService.completedAssembly(assemblyId).subscribe({
          next: () => {
            this.catalogoAssemblies = this.catalogoAssemblies.filter(a => a.id !== assemblyId);
            this.total--;
            Swal.fire('Terminado', 'El registro fue finalizado con éxito.', 'success');
          },
          error: (error) => {
            console.error(error);
            Swal.fire('Error', 'No se pudo finalizar el registro.', 'error');
          }
        });
      }
    });
  }


}

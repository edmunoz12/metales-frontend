import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { InsertionService } from '../../core/services/insertion.service';

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

  insertions: any[] = [];
  total: number = 0;
  currentPage = 1;
  pageSize: number = 20;
  search = '';
  sortColumn = 'name';
  sortDirection = 'asc';
  
  constructor(private insertionService: InsertionService){}

  ngOnInit(): void {
    this.loadInsertions();
  }

  loadInsertions(): void {
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
    this.loadInsertions();
  }

  onSortChange(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadInsertions();
  }

  onSearch(search: string) {
    this.search = search;
    this.currentPage = 1;
    this.loadInsertions();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.loadInsertions();
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolService } from '../../core/services/tool.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgbModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  totalTools: number = 0;

  constructor(private toolService: ToolService) { }

  ngOnInit(): void { 
    this.toolService.getToolCount().subscribe({
      next: (count) => {
        this.totalTools = count;
      },
      error: (err) => {
        console.error('Error al obtener el total de herramientas:', err);
      }
    });

  }

  
}

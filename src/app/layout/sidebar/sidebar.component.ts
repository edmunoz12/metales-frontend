import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgbCollapseModule, RouterModule],
  //imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  isSidebarVisible = true;
  menuItems: any[] = [];
  submenu: any[] = [];
  combinedMenuItems: any[] = [];
  collapsedState: { [key: number]: boolean } = {};

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    // Espera a que se carguen ambos menús y submenús
    forkJoin({
      menus: this.menuService.getMenu(),
      submenus: this.menuService.getSubmenu()
    }).subscribe(({ menus, submenus }) => {
      this.menuItems = menus;
      this.submenu = submenus;

      // Construir estructura combinada
      this.combinedMenuItems = this.menuItems.map(menu => {
        const relatedSubmenus = this.submenu
          .filter(sub => sub.menu_id === menu.id)  // Asegúrate que esta relación sea correcta
          .map(sub => ({
            Nombre: sub.submenu,
            Link: sub.componente
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '-'),
            icono: sub.icono || ''
          }));

        // Inicializar collapsed
        this.collapsedState[menu.id] = true;

        return {
          id: menu.id,
          Menu: menu.menu,
          icono: menu.icono,
          Submenu: relatedSubmenus
        };
      });
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  toggleCollapse(menuID: number) {
    this.collapsedState[menuID] = !this.collapsedState[menuID];
  }
  

}

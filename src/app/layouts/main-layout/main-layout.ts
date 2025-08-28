import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Header } from '../../Shared/header/header';
import { Footer } from '../../Shared/footer/footer';
import { materialProviders } from '../../shared-ui';
import { MenuService } from '../../Services/menu.service';
import { Menu } from '../../Interfaces/menu';
import { LocalStorageService } from '../../Services/LocalStorage.service';
import { NotifierService } from '../../notifier.service';


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer, materialProviders, RouterLink],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout {
  protected title = 'WEBAPP';
  @ViewChild(MatSidenav, { static: true })
  sidenav!: MatSidenav;

  private Menu = inject(MenuService)
  private router = inject(Router)

  public menus = signal<Menu[]>([]);

  constructor(private observer: BreakpointObserver,
    private notifierService: NotifierService,
    private localStorageService: LocalStorageService) {

  }

  ngOnInit(): void {
    this.observer.observe(["(max-width:800px)"])
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = "over";
          this.sidenav.close();
        } else {
          this.sidenav.mode = "side";
          this.sidenav.open();
        }
      })

    const usuarioId = this.localStorageService.getItem('UsuarioId') ?? '';
    const empresaId = this.localStorageService.getItem('EmpresaId') ?? '';

    const colorPrimary = this.localStorageService.getItem('ColorPrimary');
    const colorSecondary = this.localStorageService.getItem('ColorSecondary');
    //document.documentElement.style.setProperty('--color-primary', colorPrimary);
    //document.documentElement.style.setProperty('--color-secondary', colorSecondary);

    if (!usuarioId || !empresaId) {
      this.notifierService.showNotification("No se pudo cargar el menú: faltan datos de usuario o empresa.", 'Error', 'warning');
      this.menus.set([]);
      return;
    }

    this.Menu.GetMneu(usuarioId, empresaId).subscribe({
      next: (data) => {
        if (data.value) {
          this.menus.set(data.value);
        } else {
          alert("No se encontraron menus asignados")
          this.menus.set([]);
        }
      },
      error: (err) => {
        console.error('Error al cargar menús', err);
        this.menus.set([]);
      }
    });

  }
}

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LinksMask,
  SubLinksProducts,
} from '@init-app/components/header/commons/constants';
import { LanguajesService } from '@init-app/services';
import { ILanguageFile } from '@init-app/interfaces';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-drawer',
  templateUrl: 'drawer.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
  ],
  styleUrls: ['drawer.component.scss'],
})
export class DrawerComponent {
  @Input() showDrawer: boolean = false;

  @Output() isCloseDrawer = new EventEmitter<boolean>();

  public openProducts = false;

  constructor(
    private matIcon: MatIconRegistry,
    private sanitazer: DomSanitizer,
    private language: LanguajesService
  ) {
    this.initIcons();
  }

  public onClickCloseMenu = () => this.isCloseDrawer.emit(false);

  public onToggleProducts() {
    this.openProducts = !this.openProducts;
  }

  /**
   * @description Agregar icon de flecha abajo a listado de iconos de angular material
   */
  private initIcons(): void {
    this.matIcon.addSvgIcon(
      'chevron_down',
      this.sanitazer.bypassSecurityTrustResourceUrl(
        'assets/icons/chevron_down.svg'
      )
    );
  }

  public trackByNav(index: number, item: any): string {
    return item.label;
  }

  get lang() {
    return this.language.languageSelected;
  }

  get navigation() {
    const menuText = this.language.languageSelected.header.menuItems;
    const subMenu = (
      subMenu?: ILanguageFile['header']['menuItems'][0]['subItems']
    ) => {
      if (!subMenu) return [];

      return subMenu.map((sM, i) => ({
        label: sM.label,
        link: SubLinksProducts[i],
      }));
    };

    return menuText.map((m, i) => ({
      label: m.label,
      link: LinksMask[i],
      items: subMenu(m.subItems),
    }));
  }

  get getLoginUrl(): string {
		return environment.LOGIN_URL;
	}
}

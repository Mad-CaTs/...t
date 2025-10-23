import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { LayoutService } from '../../core/layout.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';

  constructor(private layout: LayoutService, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
  }

  toggleTheme(event: any): void {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.renderer.addClass(this.document.body, 'night-mode');
    } else {
      this.renderer.removeClass(this.document.body, 'night-mode');
    }
  }

}

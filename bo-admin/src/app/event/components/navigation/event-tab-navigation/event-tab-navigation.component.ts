import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd, Event as RouterEvent } from '@angular/router';

export interface TabOption {
  label: string;
  path: string;
}

@Component({
  selector: 'app-event-tab-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-tab-navigation.component.html',
  styleUrls: ['./event-tab-navigation.component.scss'],
})
export class EventTabNavigationComponent implements OnInit, AfterViewInit {
  @Input() tabs: TabOption[] = [];

  @ViewChild('indicator', { static: true }) indicator!: ElementRef<HTMLSpanElement>;
  @ViewChild('tabContainer', { static: true }) container!: ElementRef<HTMLDivElement>;

  activePath = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateActiveTab(this.router.url);
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveTab(event.urlAfterRedirects);
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.moveIndicator(), 0);
  }

  isActive(path: string): boolean {
    return this.activePath === path;
  }

  private updateActiveTab(url: string): void {
    const baseUrl = url.split(/[?#]/)[0];
    const found = this.tabs.find(tab => baseUrl.startsWith(tab.path));
    this.activePath = found?.path ?? '';
    setTimeout(() => this.moveIndicator(), 0);
  }

  private moveIndicator(): void {
    const cont = this.container.nativeElement;
    const activeEl = cont.querySelector('.event-tab.active') as HTMLElement;
    if (!activeEl) return;

    const { offsetLeft, offsetWidth } = activeEl;
    const indEl = this.indicator.nativeElement;

    indEl.style.left = `${offsetLeft}px`;
    indEl.style.width = `${offsetWidth}px`;
  }
}

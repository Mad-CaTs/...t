import { Component, OnDestroy, OnInit } from '@angular/core';
import type { Subscription } from 'rxjs';

import {
  Event,
  NavigationEnd,
  Router,
  RouterOutlet,
  Scroll,
} from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { INavigation } from '@init-app/interfaces';
import { mockNavigation, mockNavigationUris } from './commons/mocks/mock';

@Component({
  selector: 'app-account-tree',
  templateUrl: './account-tree.component.html',
  standalone: true,
  imports: [NavigationComponent, RouterOutlet],
  styleUrls: [],
})
export class AccountTreeComponent implements OnInit, OnDestroy {
  public navigation: INavigation[] = mockNavigation;
  public currentPage: number = 0;

  private routerSubscription: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setCurrentPage(this.router.url);
    
    this.routerSubscription = this.router.events.subscribe((v) =>
      this.watchRouter(v)
    );
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }

  /* === Watch === */
  private watchRouter(data: Event) {
    let url = '';

    if (data instanceof NavigationEnd) url = data.url;
    else if (data instanceof Scroll) url = data.routerEvent.url;

    // const urlObj = mockNavigationUris.find((m) => m.url === url);

    this.setCurrentPage(url);
    // this.currentPage = urlObj?.id || 0;
  }

  private setCurrentPage(url: string) {
    const urlObj = mockNavigationUris.find((m) => m.url === url);
    this.currentPage = urlObj?.id || 0;
  }

  /* === Events === */
  onNav(selectedId: number) {
    const uriObj = mockNavigationUris.find((m) => m.id === selectedId);

    if (!uriObj) return;

    const uri = uriObj.url;

    this.router.navigate([uri]);
  }
}

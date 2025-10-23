import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LayoutService } from '../../../core/layout.service';
import { PageInfoService, PageLink } from '../../../core/page-info.service';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
})
export class PageTitleComponent implements OnInit {
  showTitle = true;
  showBC = true;

  title$!: Observable<string>;
  bc$!: Observable<PageLink[]>;

  pageTitleCssClass = '';
  pageTitleDirection = 'row';

  constructor(
    private pageInfo: PageInfoService,
    private layout: LayoutService
  ) {}

  ngOnInit(): void {
    this.title$ = this.pageInfo.title.asObservable();

    this.bc$ = this.pageInfo.breadcrumbs.asObservable().pipe(
      map((bc) => {
        if (!bc || bc.length === 0) return [];
        const [first, ...rest] = bc;
        return [
          {
            ...first,
            path: first.path.startsWith('/dashboard')
              ? first.path
              : `/dashboard${first.path.startsWith('/') ? '' : '/'}${first.path}`
          },
          ...rest
        ];
      })
    );

    this.showTitle = this.layout.getProp('pageTitle.display') as boolean;
    this.showBC = this.layout.getProp('pageTitle.breadCrumbs') as boolean;
    this.pageTitleCssClass = this.layout.getStringCSSClasses('pageTitle');
    this.pageTitleDirection = this.layout.getProp('pageTitle.direction') as string;
  }
}

import { Injectable } from '@angular/core';

import * as EsFileLang from '@assets/languages/locales/en.json';

import { Subject } from 'rxjs';

import { ILanguageFile } from '../../interfaces/lang.interface';

@Injectable({
  providedIn: 'root',
})
export class LanguajesService {
  public showMenu: boolean = false;

  public change$ = new Subject<ILanguageFile>();
  public languageSelected: ILanguageFile = EsFileLang;
  public prefixSelected: string = 'es';

  constructor() {
    this.initLanguage();
  }

  /* === Events === */
  public openMenu() {
    this.showMenu = true;
  }

  public closeMenu() {
    this.showMenu = false;
  }

  public toogleMenu() {
    this.showMenu = !this.showMenu;
  }

  public changeLanguage(prefix: string) {
    localStorage.setItem('lang', prefix);
    this.initLanguage(prefix);
  }

  public initLanguage(prefix?: string) {
    const item = localStorage.getItem('lang');
    const pre = prefix ? prefix : item || 'es';

    this.prefixSelected = pre;

    if (prefix) localStorage.setItem('lang', prefix);

    import(`../../../../../../src/assets/languages/locales/${pre}.json`).then(
      (file) => {
        this.languageSelected = file;
        this.change$.next(file);
      }
    );
  }
}

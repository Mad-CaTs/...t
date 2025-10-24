import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LanguajesService } from '@init-app/services';

@Component({
  selector: 'app-fad',
  templateUrl: './fad.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./fad.component.scss'],
})
export class FadComponent {
  @Input() title: string = '';
  @Input() imageUrl: string =
    'https://staticv1.inclub.site/images/notice-1.png';

  @Input() hiddenTitle: boolean;

  constructor(private language: LanguajesService) {}

  get lang() {
    return this.language.languageSelected.news;
  }
}

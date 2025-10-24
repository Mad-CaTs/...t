import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';

@Component({
  selector: 'app-full-width-image',
  standalone: true,
  imports: [MatCardModule,CommonModule,ConcatenateSrcDirective],
  templateUrl: './full-width-image.component.html',
  styleUrl: './full-width-image.component.scss'
})
export default class FullWidthImageComponent {

}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './commons/components/header/header.component';
import { FooterComponent } from '@init-app/components/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './init-app.component.html',
  styleUrl: './init-app.component.scss',
})
export default class InitAppComponent {}

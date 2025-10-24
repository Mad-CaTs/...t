import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-communicated',
  templateUrl: './communicated.component.html',
  styleUrls: ['./communicated.component.scss'],
  standalone: true,
  imports: [RouterOutlet],
})
export class CommunicatedComponent {}

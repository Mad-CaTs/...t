import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'code-reference',
  templateUrl: 'code-reference.component.html',
  styleUrls: ['./code-reference.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class CodeReferenceComponent {}

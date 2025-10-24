import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { CodeReferenceComponent } from '../../../../commons/components/code-reference/code-reference.component';

@Component({
  selector: 'app-project-detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    CodeReferenceComponent,
    RouterLink,
  ],
})
export default class ProjectDetailComponent {}

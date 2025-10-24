import { Component, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'card-project',
  templateUrl: 'card-project.component.html',
  styleUrls: ['./card-project.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    RouterLink,
  ],
})
export class CardProjectComponent {
  @Output() clickDetail = new EventEmitter<boolean>();

  onClickDetail = () => this.clickDetail.emit(true);
}

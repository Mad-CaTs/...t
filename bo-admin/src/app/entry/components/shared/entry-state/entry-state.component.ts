import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-entry-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entry-state.component.html',
  styleUrls: ['./entry-state.component.scss']
})
export class EntryStateComponent {
  @Input() message = 'No data';
}

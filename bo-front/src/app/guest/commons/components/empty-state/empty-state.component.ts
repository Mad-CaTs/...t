import { Component, Input } from '@angular/core';
import { EmptyState } from '../../interfaces/guest-components.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'guest-empty-state',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {
  @Input() state : EmptyState;
}

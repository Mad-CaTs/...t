import { Component, Input } from '@angular/core';
import { Panel } from '../../interfaces/guest-components.interface';
import { DividerModule } from 'primeng/divider';

@Component({
	selector: 'guest-panels',
	standalone: true,
	imports: [DividerModule],
	templateUrl: './panels.component.html',
	styleUrl: './panels.component.scss'
})
export class PanelsComponent {
	@Input() panel: Panel;
}

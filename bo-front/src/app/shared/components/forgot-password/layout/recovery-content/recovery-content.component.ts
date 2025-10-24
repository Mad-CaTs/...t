import { Component, Input } from '@angular/core';

interface RecoveryContent {
	title: string;
	message: string;
}

@Component({
	selector: 'app-recovery-content',
	standalone: true,
	imports: [],
	templateUrl: './recovery-content.component.html',
	styleUrl: './recovery-content.component.scss'
})
export class RecoveryContentComponent {
  @Input() recoveryContent: RecoveryContent;
}

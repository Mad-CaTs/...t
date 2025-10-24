import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';
import { CommonModule } from '@angular/common';
import { ChatButtonComponent } from '@shared/components/chat-button/chat-button.component';
import { ModalChatbotComponent } from '@shared/components/modal/modal-chatbot/modal-chatbot.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'card-proyect',
	templateUrl: 'card-proyect.component.html',
	styleUrls: ['./card-proyect.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatDividerModule,
		MatProgressBarModule,
		MatCardModule,
		ConcatenateSrcDirective,
		ChatButtonComponent
	]
})
export class CardProyectComponent {
	ref: DynamicDialogRef;

	constructor(private dialogService: DialogService) {}
	openChat() {
		console.log('Chat iniciado');
	}
	openModal() {
		this.ref = this.dialogService.open(ModalChatbotComponent, {
			header: 'Chatboot de inclub activo',

			width: '45vw',
			baseZIndex: 10000,
			closable: true,
			style: {
				position: 'fixed',
				bottom: '20px',
				right: '20px',
				margin: '0',
				padding: '0'
			}
		});
	}
}

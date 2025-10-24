import { Component, Input, SimpleChanges } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import TabProfilesComponent from 'src/app/profiles/commons/components/tab-profiles/tab-profiles.component';
import { ITabs } from 'src/app/profiles/commons/interface';
import { TabsProfiles } from 'src/app/profiles/commons/constants/tabs-profiles.constant';
import { Profile } from 'src/app/authentication/commons/enums';
import { CardProyectComponent } from 'src/app/profiles/commons/components/card-proyect/card-proyect.component';
import { PetResourceServerService } from './commons/services/pet-resource-server.service';
import { MyWalletDetailComponent } from './commons/components/my-wallet-detail/my-wallet-detail.component';
import { MyBriefcaseComponent } from './commons/components/my-resume/my-briefcase.component';
import { MembershipStatusCardComponent } from './commons/components/investor-cards/commons/components/membership-status-card/membership-status-card.component';
import { InvestorCardsComponent } from './commons/components/investor-cards/investor-cards.component';
import { PointCardComponent } from '../../../../commons/components/point-card/point-card.component';
import { CommonModule } from '@angular/common';
import { ChatButtonComponent } from '@shared/components/chat-button/chat-button.component';
import { WhatsappButtonComponent } from '@shared/components/whatsapp-button/whatsapp-button.component';
import { ModalChatbotComponent } from '@shared/components/modal/modal-chatbot/modal-chatbot.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-default-component',
	templateUrl: './default.component.html',
	styleUrls: ['./default.component.scss'],
	standalone: true,
	imports: [
		MatDividerModule,
		MatProgressBarModule,
		CardProyectComponent,
		TabProfilesComponent,
		MyWalletDetailComponent,
		MyBriefcaseComponent,
		MembershipStatusCardComponent,
		InvestorCardsComponent,
		PointCardComponent,
		CommonModule,
		WhatsappButtonComponent,
		ChatButtonComponent
	]
})
export default class DesktopComponent {
	public tabs: Array<ITabs> = TabsProfiles(Profile.PARTNER);
	@Input() investorPoints: any;
	ref: DynamicDialogRef;
	shouldOpenModal = false; 
	@Input() isLoading: boolean = false;
	// hijo.component.ts
@Input() userStatus!: string;
@Input() statusColor!: { textColor: string; backgroundColor: string };
@Input() rangoPeriodo;


	constructor(
		private readonly petResourceServerService: PetResourceServerService,
		private dialogService: DialogService
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['rangoPeriodo']) {
		  console.log('📦 rangoPeriodo recibido en hijo:', this.rangoPeriodo);
		}
	  }

	getTest() {
		this.petResourceServerService.testApi().subscribe({
			next: (response) => console.log(response),
			error: (error) => console.error(error)
		});
	}

	cards = [
		{ value: '120', image: 'assets/icons/frame.svg', description: 'Retorno mensual' },
		{ value: '150', image: 'assets/icons/frame1.svg', description: 'Inversión diaria' },
		{ value: '200', image: 'assets/icons/frame2.svg', description: 'Retorno anual' }
	];

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
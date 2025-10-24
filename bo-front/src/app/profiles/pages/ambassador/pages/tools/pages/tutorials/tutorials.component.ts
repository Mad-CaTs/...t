import { Component } from '@angular/core';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CardProyectComponent } from 'src/app/profiles/commons/components/card-proyect/card-proyect.component';
import VideoCardComponent from './commons/component/video-card/video-card.component';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { toolItemsNavigation } from '../../commons/mocks/mock';

@Component({
	selector: 'app-tutorials',
	standalone: true,
	templateUrl: './tutorials.component.html',
	styleUrl: './tutorials.component.scss',
	imports: [
		NavigationComponent,
		MatProgressBarModule,
		CardProyectComponent,
		VideoCardComponent,
		CommonModule
	]
})
export default class TutorialsComponent {
	public currentStep = 2;
	constructor(private location: Location) {}

	onChangeStep(newStep: number) {
		this.currentStep = newStep;
		if (newStep === 1) {
			this.location.back();
		}
	}

	get stepNavigation() {
		return toolItemsNavigation;
	}

	videos = [
		{
			title: 'Como pagar con mi Wallet',
			date: 'Streaming Sep 15, 2023',
			previewText: 'Preview | Homepage',
			videoUrl: '',
		},
		{
			title: 'Como pagar por Banco',
			date: 'Streaming Sep 15, 2023',
			previewText: 'Preview | Homepage',
      videoUrl: '',

		},
		{
			title: 'Como pagar con Paypal',
			date: 'Streaming Sep 15, 2023',
			previewText: 'Preview | Homepage',
			videoUrl: '' 
		},
		{
			title: 'Como pagar con Wallet y Vaucher',
			date: 'Streaming Sep 15, 2023',
			previewText: 'Preview | Homepage',
			videoUrl: '' 
		},
		{
			title: 'Como comprar una membresía',
			date: 'Streaming Sep 15, 2023',
			previewText: 'Preview | Homepage',
			videoUrl: '' 
		},
		{
			title: 'Como pagar por dos vouchers',
			date: 'Streaming Sep 15, 2023',
			previewText: 'Preview | Homepage',
			videoUrl: '' 
		}
	];

	goBack() {
		this.location.back();
	}
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { STEP_ROUTES } from '../../../../commons/constants';
import { ToolsService } from '../../../../commons/services/tools.service';
import CardComponent from '../../../../commons/componets/card/card.component';
import CardLegalizacionComponent from './componets/legalization-card/card.component';

@Component({
  selector: 'app-legalization-cards-component',
  standalone: true,
  imports: [ CommonModule,NavigationComponent,CardLegalizacionComponent],
  templateUrl: './legalization-cards-component.component.html',
  styleUrl: './legalization-cards-component.component.scss'
})
export default class LegalizationCardsComponentComponent {
  constructor(private router: Router,private toolsService:ToolsService) {}
	public currentStep = 5;

  get stepNavigation() {
    return this.toolsService.getStepNavigation(this.currentStep);
  }

  

 	onChangeStep(newStep: number) {
		const route = STEP_ROUTES[newStep];
		if (route) {
			this.router.navigate([route]);
		}
	}


  cardsData = [
		{
			title: 'Tutoriales',
			content:
				'Aquí podrás visualizar tutoriales de como realizar las funciones del sistema entre otros.',
			icon: 'shop_two',
			prueba: '/profile/ambassador/tools/tutorials'
		},
		{
			title: 'Legalidad',
			content:
				'Encontrarás documentos e imágenes referentes a la legalización de membresías, entre otros.',
			icon: 'archive',
			prueba: '/profile/ambassador/tools/legal-information'
		},
		{
			title: 'Preguntas frecuentes',
			content: 'Descubre presentaciones interesantes sobre temas variados.',
			icon: 'unarchive',
			prueba: '/profile/ambassador/tools/faq-section'
		},
    {
			title: 'Tutoriales',
			content:
				'Aquí podrás visualizar tutoriales de como realizar las funciones del sistema entre otros.',
			icon: 'shop_two',
			prueba: '/profile/ambassador/tools/tutorials'
		},
		{
			title: 'Legalidad',
			content:
				'Encontrarás documentos e imágenes referentes a la legalización de membresías, entre otros.',
			icon: 'archive',
			prueba: '/profile/ambassador/tools/legal-information'
		},
		{
			title: 'Preguntas frecuentes',
			content: 'Descubre presentaciones interesantes sobre temas variados.',
			icon: 'unarchive',
			prueba: '/profile/ambassador/tools/faq-section'
		}
	];


}

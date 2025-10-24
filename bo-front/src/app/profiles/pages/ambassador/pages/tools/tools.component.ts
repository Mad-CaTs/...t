import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';
import CardComponent from './commons/componets/card/card.component';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { ToolsService } from './commons/services/tools.service';

@Component({
	selector: 'app-tools',
	templateUrl: './tools.component.html',
	standalone: true,
	styleUrls: ['./tools.component.scss'],
	imports: [ConcatenateSrcDirective, CardComponent, CommonModule, NavigationComponent]
})
export default class ToolsComponent {
	constructor(private router: Router, private location: Location, private toolsService: ToolsService) {}
	public currentStep = 1;

	onChangeStep(newStep: number) {
		this.currentStep = newStep;
		if (newStep === 1) {
			this.location.back();
		}
	}
	get stepNavigation() {
		return this.toolsService.getStepNavigation(this.currentStep);
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
			title: 'Material de Marketing',
			content: 'Aquí encontrarás, contenido en imágenes, videos, de todos los proyectos.',
			icon: 'file_copy',
			prueba: '/profile/ambassador/tools/marketing-material'
		}
	];

	navigateToComponent(prueba: string) {
		this.router.navigate([prueba]);
	}
}

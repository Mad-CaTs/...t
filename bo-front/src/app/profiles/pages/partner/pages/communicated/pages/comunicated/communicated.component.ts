import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CodeReferenceComponent } from '../../../../commons/components/code-reference/code-reference.component';
import EventDetailCardComponent from '../../commons/components/event-detail-card/event-detail-card.component';
import { CommonModule } from '@angular/common';
import { comunicados, contenidoExpandido, contenidoPrincipal, eventos } from './commons/mocks/mock';
import FullWidthImageComponent from '../../commons/components/full-width-image/full-width-image.component';
import { MatCardModule } from '@angular/material/card';
import { ConcatenateSrcDirective } from '@shared/directives/concatenate-src/concatenate-src.directive';
import InfoCardComponent from '../../commons/components/info-card/info-card.component';
import CardCommunicatedComponent from '../../commons/components/card-communicated/card-communicated.component';

@Component({
	selector: 'app-communicated',
	templateUrl: './communicated.component.html',
	styleUrls: ['./communicated.component.scss'],
	standalone: true,
	imports: [
		CardCommunicatedComponent,
		CodeReferenceComponent,
		EventDetailCardComponent,
		CommonModule,
		FullWidthImageComponent,
		MatCardModule,
		ConcatenateSrcDirective,
    InfoCardComponent
	]
})
export default class CommunicatedComponent {
	contenidoPrincipal = contenidoPrincipal;
	contenidoExpandido = contenidoExpandido;
	contenidoActual = this.contenidoPrincipal;
	mostrarDetalles = false;
	comunicados = comunicados;
	eventos = eventos;

	constructor(private router: Router) {}

	onDetail(id: number) {
		this.router.navigate([`/profile/partner/communicated/details/${id}`]);
	}

	toggleDetalles() {
/* 		this.mostrarDetalles = !this.mostrarDetalles;
 */		this.contenidoActual = this.mostrarDetalles ? this.contenidoExpandido : this.contenidoPrincipal;
	}

	navigateToOverview() {
		this.router.navigate([`/profile/partner/communicated/overview`]);
	}
}

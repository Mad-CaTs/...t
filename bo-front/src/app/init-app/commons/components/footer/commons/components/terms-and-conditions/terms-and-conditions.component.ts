import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '@init-app/components/footer/footer.component';
import { HeaderComponent } from '@init-app/components/header/header.component';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
	selector: 'app-terms-and-conditions',
	standalone: true,
	imports: [CommonModule, HeaderComponent, FooterComponent, PdfViewerModule],
	templateUrl: './terms-and-conditions.component.html',
	styleUrl: './terms-and-conditions.component.scss'
})
export default class TermsAndConditionsComponent {
	pdfUrl: string = '../../assets/documents/terms-and-conditions.pdf';
	currentPage: number = 1;
	pdf: PDFDocumentProxy;

	constructor(private router: Router) {}

	goHome() {
		this.router.navigate(['/home']);
	}

	afterLoadComplete(pdf: PDFDocumentProxy): void {
		this.pdf = pdf;
		const container = document.querySelector('.ng2-pdf-viewer-container') as HTMLElement;
	}

	scrollToSection(position: string): void {
		if (position === 'end') {
			window.scrollTo({
				top: document.body.scrollHeight,
				behavior: 'smooth'
			});
		} else {
			const container = document.querySelector('.ng2-pdf-viewer-container') as HTMLElement;
			if (container) {
				let scrollPosition = 0;

				if (position === 'middle') {
					scrollPosition = (container.scrollHeight - container.offsetHeight) / 2;
				} else if (position === 'footer') {
					scrollPosition = container.scrollHeight - container.offsetHeight;
				}

				container.scrollTo({
					top: scrollPosition,
					behavior: 'smooth'
				});
			} else {
				console.warn('No se encontró el contenedor para el visor PDF.');
			}
		}
	}

	prevPage() {
		if (this.currentPage > 1) {
			this.currentPage--;
		}
	}

	nextPage() {
		if (this.currentPage < this.pdf?._pdfInfo.numPages) {
			this.currentPage++;
		}
	}
}

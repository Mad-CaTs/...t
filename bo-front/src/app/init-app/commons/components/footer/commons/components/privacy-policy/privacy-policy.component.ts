import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '@init-app/components/footer/footer.component';
import { HeaderComponent } from '@init-app/components/header/header.component';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
	selector: 'app-privacy-policy',
	standalone: true,
	imports: [CommonModule, HeaderComponent, FooterComponent, PdfViewerModule],
	templateUrl: './privacy-policy.component.html',
	styleUrl: './privacy-policy.component.scss'
})
export default class PrivacyPolicyComponent implements OnInit {
	pdfUrl: string = '../../assets/documents/privacy-policy.pdf';

	currentPage: number = 1;
	pdf: PDFDocumentProxy;
	outline: any[] = [];
	totalPages: number = 0;

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.scrollToSection('header');
	}

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

	navigateToPage(pageNumber: number): void {
		this.currentPage = pageNumber;
	}

	loadOutline() {
		this.pdf.getOutline().then((outline: any[]) => {
			this.outline = outline;
		});
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

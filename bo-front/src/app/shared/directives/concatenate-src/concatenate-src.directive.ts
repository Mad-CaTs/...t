import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { environment } from '@environments/environment';

@Directive({
	selector: '[appConcatenateSrc]',
	standalone: true
})
export class ConcatenateSrcDirective {
	@Input('appConcatenateSrc') imageName: string;

	constructor(private el: ElementRef, private renderer: Renderer2) {}

	ngOnInit() {
		const basePath = environment.URL_IMG;

		const imagePath = `${basePath}${this.imageName}`;

		this.renderer.setAttribute(this.el.nativeElement, 'src', imagePath);
	}
}

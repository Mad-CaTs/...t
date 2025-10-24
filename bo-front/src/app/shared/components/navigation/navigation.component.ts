/* import { CommonModule } from '@angular/common';
import {
	AfterContentChecked,
	AfterContentInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import { INavigation } from '@init-app/interfaces';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	standalone: true,
	imports: [CommonModule],
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements AfterContentInit, OnChanges {
	@Input() data: INavigation[] = [];
	@Input() selected: number = 0;
	@Input() isDisabled: boolean = false;
	@Input() useNewDesign: boolean = false;
	@Input() noBgSecondary: boolean = false;

	@ViewChild('parent') parent: ElementRef<HTMLDivElement>;

	@Output() changeSelected = new EventEmitter<number>();

	public transition = 'translateX(0px)';
	public sizeBar: string;

	constructor(private cdr: ChangeDetectorRef) {}

	ngAfterContentInit(): void {
		this.updateNavigationBar();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['selected'] || changes['useNewDesign']) {
			this.updateNavigationBar();
		}
	}

	private updateNavigationBar(): void {
		this.cdr.detectChanges();
		this.transition = this.getTransation();
		this.sizeBar = this.getSizeBar();
	}

	getTransation() {
		const parent = this.parent?.nativeElement;

		if (!parent) return 'translateX(0px)';

		const index = this.data.findIndex((d) => d.id === this.selected);

		if (index === 0 || index === -1) return 'translateX(0px)';

		let currentIndex = index;
		let totalWidth = 0;

		while (currentIndex > 0) {
			const prevId = this.data[currentIndex - 1].id;
			const id = `#nav-${prevId}`;
			const element = parent.querySelector(id);

			totalWidth += element.clientWidth || 0;
			currentIndex--;
		}

		return `translateX(${totalWidth}px)`;
	}

	private getSizeBar(): string {
		const parent = this.parent?.nativeElement;
		const id = `#nav-${this.selected}`;
		const element = parent.querySelector(id);
		return `${element.clientWidth}px`;
	}

	onClickTab(item: INavigation) {
		this.changeSelected.emit(item.id);
		this.updateNavigationBar();
	}

	isImage(icon: string): boolean {
		return (
			icon?.includes('/') || icon?.includes('.png') || icon?.includes('.jpg') || icon?.includes('.svg')
		);
	}
}
 */

import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import { INavigation } from '@init-app/interfaces';
import { RangeManagerService } from 'src/app/profiles/pages/ambassador/pages/tree/pages/range-manager/commons/service/range-manager.service';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	standalone: true,
	imports: [CommonModule],

	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements AfterViewInit, OnChanges {
	@Input() data: INavigation[] = [];
	@Input() selected: number = 0;
	@Input() isDisabled: boolean = false;
	@Input() useNewDesign: boolean = false;
	@Input() noBgSecondary: boolean = false;

	@ViewChild('parent') parent!: ElementRef<HTMLDivElement>;

	@Output() changeSelected = new EventEmitter<number>();

	public transition = 'translateX(0px)';
	public sizeBar: string = '0px';

	constructor(private cdr: ChangeDetectorRef,
	private	_rangeManagerService: RangeManagerService
	) {}

	ngAfterViewInit(): void {
		// garantizamos que el DOM ya esté disponible
		this.updateNavigationBar();
		 this.cdr.detectChanges();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['selected'] || changes['useNewDesign']) {
			// espera un ciclo para que el DOM pinte el nuevo seleccionado
			setTimeout(() => this.updateNavigationBar(), 0);
		}
	}

	private updateNavigationBar(): void {
		this.cdr.detectChanges();
		this.transition = this.getTransation();
		this.sizeBar = this.getSizeBar();
	}

	getTransation(): string {
		const parent = this.parent?.nativeElement;
		if (!parent) return 'translateX(0px)';

		const index = this.data.findIndex((d) => d.id === this.selected);
		if (index === 0 || index === -1) return 'translateX(0px)';

		let currentIndex = index;
		let totalWidth = 0;

		while (currentIndex > 0) {
			const prevId = this.data[currentIndex - 1].id;
			const element = parent.querySelector<HTMLElement>(`#nav-${prevId}`);
			totalWidth += element?.clientWidth || 0;
			currentIndex--;
		}

		return `translateX(${totalWidth}px)`;
	}

	private getSizeBar(): string {
		const parent = this.parent?.nativeElement;
		const element = parent?.querySelector<HTMLElement>(`#nav-${this.selected}`);				
		return `${element?.clientWidth || 0}px`;
	}

	onClickTab(item: INavigation) {
		this.changeSelected.emit(item.id);
		this.updateNavigationBar();
		this._rangeManagerService.setFlagRangeManager(true);
	}

	isImage(icon: string): boolean {
		return (
			icon?.includes('/') || icon?.includes('.png') || icon?.includes('.jpg') || icon?.includes('.svg')
		);
	}
}

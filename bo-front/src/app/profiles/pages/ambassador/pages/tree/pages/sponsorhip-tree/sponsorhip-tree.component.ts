import { Component, ElementRef, ViewChild } from '@angular/core';

import { TreeTemplateComponent } from '../../commons/components/tree-template/tree-template.component';
import { ILeyend } from '../../commons/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { TreeService } from '../../commons/services/tree.service';

@Component({
	selector: 'app-sponsorhip-tree',
	templateUrl: './sponsorhip-tree.component.html',
	standalone: true,
	imports: [TreeTemplateComponent],
	styleUrls: []
})
export default class SponsorhipTreeComponent {
	public leyends: ILeyend[] = [];
	public type: string = 'P';
	@ViewChild('containerZoom') containerZoom: ElementRef;

	public zoomValue: number = 0.2;
	public inZoom: boolean = false;
	private destroy$: Subject<void> = new Subject<void>();

	constructor(private treeService: TreeService) {}

	ngOnInit(): void {
		this.getStates();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private getStates() {
		this.treeService
		  .getListAllStates()
		  .pipe(takeUntil(this.destroy$))
		  .subscribe(
			(leyends) => {
			  this.leyends = leyends;
        console.log("leyends",leyends);
        
			},
			(error) => {
			  console.error('Error loading leyends:', error);
			}
		  );
	  }
	
	onMouseMoveBoxZoom(e: MouseEvent) {
		if (!this.inZoom || !this.containerZoom?.nativeElement) return;

		const offsetX = e.x - 10;
		const el = this.containerZoom.nativeElement as HTMLDivElement;
		const parentX = el.getBoundingClientRect().x;

		let x = offsetX - parentX;

		if (x >= 48) x = 48;
		else if (x <= 0) x = 0;

		this.zoomValue = x / 48;
	}

	onMouseUpBoxZoom(e: MouseEvent) {
		this.onMouseMoveBoxZoom(e);
		this.inZoom = false;
	}

	get marginLeftZoom() {
		const val = this.zoomValue * 48;

		return `${val}px`;
	}
}

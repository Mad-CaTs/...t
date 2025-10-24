import {
	AfterViewInit,
	ChangeDetectionStrategy,
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
import { TreeComponent } from '../tree/tree.component';
import { ILeyend } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-tree-template',
	templateUrl: './tree-template.component.html',
	standalone: true,
	imports: [CommonModule, TreeComponent],
	styleUrls: ['./tree-template.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeTemplateComponent implements OnChanges {
	@Input() title: string = '';
	@Input() leyends: ILeyend[];
	@Input() zoomValue: number = 0.2;
	@Input() type: string;

	public openAll: boolean = false;
	public isMenuOpen = false;
	@ViewChild('containerZoom') containerZoom: ElementRef;
	@ViewChild('treeComponent') treeComponent!: TreeComponent;
	public inZoom: boolean = false;
	public disabledUser: boolean = this.userInfoService.disabled;
	private hasJustUpdated: boolean = false;
	private treeUpdateSubject = new Subject<void>();

	constructor(
		public userInfoService: UserInfoService,
		private cdr: ChangeDetectorRef) {
		this.treeUpdateSubject.pipe(debounceTime(500)).subscribe(() => {
			if (this.treeComponent && !this.hasJustUpdated) {
				this.hasJustUpdated = true;
				this.treeComponent.updateTreeData();
				setTimeout(() => (this.hasJustUpdated = false), 500);
			}
		});
	}

	// ngOnChanges(changes: SimpleChanges) {
	// 	if (changes['leyends'] || changes['zoomValue'] || changes['type']) {
	// 		const leyendsChanged = changes['leyends']?.previousValue !== changes['leyends']?.currentValue;
	// 		const zoomChanged = changes['zoomValue']?.previousValue !== changes['zoomValue']?.currentValue;
	// 		const typeChanged = changes['type']?.previousValue !== changes['type']?.currentValue;

	// 		if (leyendsChanged || zoomChanged || typeChanged) {
	// 			this.treeUpdateSubject.next();
	// 		}
	// 	}
	// }

	ngOnChanges(changes: SimpleChanges) {
		const leyendsChanged = changes['leyends']?.previousValue !== changes['leyends']?.currentValue;
		const zoomChanged = changes['zoomValue']?.previousValue !== changes['zoomValue']?.currentValue;
		const typeChanged = changes['type']?.previousValue !== changes['type']?.currentValue;
    


    

		if (leyendsChanged || zoomChanged || typeChanged) {
			this.treeUpdateSubject.next();
		}
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
	public onChangeOpenValue(open: boolean) {
		this.openAll = open;
		this.cdr.detectChanges();

		if (this.treeComponent) {
			this.treeComponent.onActionAll(this.openAll);
			this.cdr.detectChanges();
		}
	}

	get leyendsMd() {
		if (!this.leyends) {
			return [];
		}
		type Type = typeof this.leyends;

		const result: Type[] = [];
		let currentCol = 0;

		this.leyends.forEach((leyend) => {
			const col = result[currentCol];

			if (!col) result[currentCol] = [];
			else if (col.length >= 3) {
				currentCol++;
				result[currentCol] = [];
			}

			result[currentCol].push(leyend);
		});

		return result;
	}

	public refreshTree(): void {
		if (this.treeComponent) {
			this.treeComponent.updateTreeData();
			setTimeout(() => {
				this.treeComponent.onActionAll(this.openAll);
				this.cdr.detectChanges();
			}, 100);
		} else {
			console.error('TreeComponent aún no está inicializado');
		}
	}
}

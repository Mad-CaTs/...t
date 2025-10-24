import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnChanges,
	SimpleChanges,
	ViewChild
} from '@angular/core';

import { ILeyend, ITreeDataChildren, ITreeDataV2 } from '../../interfaces';
import { ISponsorTree } from '../../interfaces/sponsor-tree.interfaces';
import { TreeService } from '../../services/tree.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { debounceTime, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DashboardService } from '../../../../dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { IPointKafka, PointKafkaBody } from '../../../../dashboard/pages/primary-and-secondary-profile/commons/interfaces/dashboard.interface';

@Component({
	selector: 'app-tree',
	templateUrl: './tree.component.html',
	styleUrls: ['./tree.component.scss'],
	imports: [CommonModule, ProgressSpinnerModule],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements AfterViewInit, OnChanges {
	@Input() leyends: ILeyend[];
	@Input() zoomValue: number = 0.2;
	@Input() openAll: boolean;
	@Input() type: string;
	@Input() sponsorId: number = this.userInfoService.userInfo.id;

	@ViewChild('container') container: ElementRef<HTMLElement>;
	@ViewChild('scroller') scroller: ElementRef<HTMLDivElement>;

	public body: ISponsorTree;
	public treeData: ITreeDataV2 | null = null;
	private apiCalled = false;
	private connectorsIds: string[] = [];
	private levelData: { id: number; open: boolean; grouper: HTMLElement }[] = [];
	public formatedZoomValue: number = 1;
	public isLoading: boolean = true;
	public scrollActivate: boolean = false;
	private actualLeft: number = 0;
	private actualX: number = 0;
	private actualTop: number = 0;
	private actualY: number = 0;

	constructor(
		private cdr: ChangeDetectorRef,
		private treeService: TreeService,
		private dashboardService: DashboardService,
		public userInfoService: UserInfoService
	) { }

	ngOnInit(): void {
		if (this.sponsorId !== undefined) {
			this.body = {
				id: this.sponsorId,
				tipo: this.type
			};
		}
	}

	ngAfterViewInit(): void {
		if (this.treeData) {
			this.renderTree();
			setTimeout(() => {
				this.fixConnectors();
				this.fixFirstConnector();
			}, 40);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['zoomValue']) {
			this.formatedZoomValue = 0.5 * this.zoomValue + 0.5;
		}

		if (changes['openAll']) {
			console.log('Valor de openAll en TreeComponent:', this.openAll);
			this.onActionAll(this.openAll);
			this.cdr.detectChanges();
		}

		if (changes['sponsorId'] && changes['sponsorId'].currentValue !== undefined) {
			this.body = {
				id: this.sponsorId,
				tipo: this.type
			};
			this.updateTreeData();
		}

		setTimeout(() => {
			this.fixConnectors();
			this.fixFirstConnector();
			this.cdr.detectChanges();
		}, 40);
	}

	public updateTreeData(): void {
		console.log('Llamando a updateTreeData... API llamada');
		if (this.apiCalled) return;
		this.apiCalled = true;

		this.treeService
			.postTreeSponsorById(this.body)
			.pipe(take(1))
			.subscribe(
				{
					next: (data) => {
						if (data.data && data.data?.children) {
							this.treeData = {
								idsociomaster: data.data?.idsociomaster,
								childs: data.data?.children
							};
							this.renderTree();
						} else {
							console.error('Formato de datos inválido:', data.data);
						}
						this.apiCalled = false;
					},
					error: (error) => {
						console.error('Error al cargar los datos del árbol:', error);
						this.apiCalled = false;
					}
				}
			);
	}

	private renderTree(): void {
		const el = this.container?.nativeElement;
		if (el && this.treeData) {
			console.log('Limpiando y regenerando el árbol...');
			el.innerHTML = '';
			this.generateTree(el, this.treeData.childs);
			this.cdr.detectChanges();
			setTimeout(() => {
				this.fixConnectors();
				this.fixFirstConnector();
				this.isLoading = false;
				this.cdr.detectChanges();
			}, 40);
		} else {
			console.warn('Los datos del árbol aún no están disponibles.');
		}
	}

	private postTreeSponsorById() {
		console.log('Llamando a la API por primera vez...');
		if (this.apiCalled) return;
		this.apiCalled = true;

		this.treeService.postTreeSponsorById(this.body).subscribe(
			(data) => {
				if (data.data && data.data?.children) {
					this.treeData = {
						idsociomaster: data.data?.idsociomaster,
						childs: data.data?.children
					};
					this.renderTree();
				} else {
					console.error('Formato de datos inválido:', data.data);
				}
				this.apiCalled = false;
			},
			(error) => {
				console.error('Error al cargar los datos del árbol:', error);
				this.apiCalled = false;
			}
		);
	}

	public onActionAll(openAll: boolean) {
		for (const level of this.levelData) {
			if (level.open !== openAll) {
				this.onToggleTemplate(level.id);
			}
		}
		this.cdr.detectChanges();
	}

	onToggleTemplate(id: number) {
		if (this.scrollActivate) return;

		const data = this.levelData.find((l) => l.id === id);
		const otherGrouper = data.grouper.children[2];
		const currentZoomValue = this.formatedZoomValue;

		otherGrouper.classList.remove('d-flex');
		otherGrouper.classList.remove('d-none');

		if (data.open) {
			otherGrouper.classList.remove('d-flex');
			otherGrouper.classList.add('d-none');
		} else {
			otherGrouper.classList.remove('d-none');
			otherGrouper.classList.add('d-flex');
		}

		data.open = !data.open;
		this.formatedZoomValue = 1;
		this.fixConnectors();
		this.fixFirstConnector();
		this.formatedZoomValue = currentZoomValue;
	}

	onMouseDown(e: MouseEvent) {
		const target = this.scroller?.nativeElement;

		this.scrollActivate = true;
		this.actualLeft = target.scrollLeft;
		this.actualX = e.clientX;
		this.actualTop = target.scrollTop;
		this.actualY = e.clientY;
	}

	onMouseMove(e: MouseEvent) {
		const target = this.scroller.nativeElement;

		if (!this.scrollActivate) return;

		const left = this.actualLeft + this.actualX - e.clientX;
		const top = this.actualTop + this.actualY - e.clientY;

		target.scrollLeft = left;
		target.scrollTop = top;
	}

	public generateTree(parent: HTMLElement, data: ITreeDataChildren[], showBox?: boolean) {
		let showNode: string = 'd-flex';
		this.isLoading = true;
		if ((showBox = !undefined && showBox == false)) {
			showNode = 'd-none';
		}
		const container = this.generateContainer(showNode);

		if (data && data.length > 0) {
			for (const boxData of data) {
				const idConnector = `connector-${this.connectorsIds.length}`;
				const hasChildren = boxData.children && boxData.children.length > 0;
				const grouper = this.generateGrouper();
				const template = this.generateTemplateBox(
					boxData.nombre_socio,
					boxData.estado_socio,
					boxData.subscriptionStatus.status,
					true,
					hasChildren,
					boxData.idsocio
				);
				const connector = this.generateConnector(idConnector);

				grouper.appendChild(template);

				if (hasChildren) {
					grouper.appendChild(connector);
					this.connectorsIds.push(idConnector);
					this.generateTree(grouper, boxData.children, false);

					this.levelData.push({ id: boxData.idsocio, open: false, grouper });

					template.onclick = () => this.onToggleTemplate(boxData.idsocio);
				}

				container.appendChild(grouper);
			}
		}
		parent.appendChild(container);
	}

	public fixConnectors() {
		if (!this.container || !this.treeData || !this.treeData.childs) return;

		const idsRemoved: string[] = [];

		for (const id of this.connectorsIds) {
			const connector = document.getElementById(id);
			if (!connector) continue;

			const parent = connector.parentNode as HTMLElement;
			const grouper = parent.children[2];
			if (!grouper || grouper.children.length === 0) continue;

			const firstChild = grouper.children[0].children[0] as HTMLElement;
			const lastChild = grouper.children[grouper.children.length - 1].children[0] as HTMLElement;

			if (!firstChild || !lastChild) continue;

			const space = lastChild.offsetTop - firstChild.offsetTop;

			connector.style.height = `${space}px`;
			connector.style.left = `${firstChild.offsetLeft}px`;
			connector.style.top = `${firstChild.offsetTop + 39}px`;

			if (space === 0) {
				connector.className = 'd-none';
			} else {
				connector.className = 'line-connector';
			}
		}

		this.connectorsIds = this.connectorsIds.filter((id) => !idsRemoved.includes(id));
	}

	public fixFirstConnector() {
		const connector = document.getElementById('connector-first');
		if (!connector || !this.container) return;

		const grouper = this.container.nativeElement.children[0];
		if (!grouper || grouper.children.length === 0) return;

		const firstChild = grouper.children[0]?.children[0] as HTMLElement;
		const lastChild = grouper.children[grouper.children.length - 1]?.children[0] as HTMLElement;
		if (!firstChild || !lastChild) return;

		const space = lastChild.offsetTop - firstChild.offsetTop;

		connector.style.height = `${space}px`;
		connector.style.left = `${firstChild.offsetLeft}px`;
		connector.style.top = `${firstChild.offsetTop + 39}px`;

		if (space === 0) connector.remove();
	}

	private generateTemplateBox(
		name: string,
		statusId: number,
		subscriptionStatus: number,
		leftLine: boolean = true,
		rightLine: boolean = true,
		idSocio: number
	) {
		const leyend = this.leyends.find((l) => l.idState === (subscriptionStatus ?? statusId));
		const parent = document.createElement('article');
		const line = document.createElement('div');
		const container = document.createElement('div');
		const header = document.createElement('div');
		const body = document.createElement('div');
		const exclamationButton = document.createElement('button');
		const tooltip = document.createElement('div');
		const headerText = document.createElement('span');
		const whiteColor = '#FFFFFF';
		const defaultColor = '#8BC34A';
		const backgroundColor = leyend?.colorRGB || defaultColor;
		parent.className = `d-flex flex-row align-items-center w-auto`;
		line.className = 'line-tree';
		header.className =
			'w-100 py-2 rounded-top border-top border-start border-end border-black d-flex flex-row justify-content-center align-items-center text-white';
		header.style.backgroundColor = backgroundColor;
		headerText.textContent = name || 'No encontrado';
		headerText.className = 'header-text';
		header.appendChild(headerText);
		if (this.type == 'R') {
			tooltip.className = 'tooltip-box';
			tooltip.style.display = 'none';
			tooltip.style.position = 'absolute';
			tooltip.style.backgroundColor = '#f9f9f9';
			tooltip.style.border = '1px solid #ccc';
			tooltip.style.borderRadius = '5px';
			tooltip.style.padding = '10px';
			tooltip.style.width = '150px';
			tooltip.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
			tooltip.style.zIndex = '10';
			const iconImg = document.createElement('img');
			iconImg.src = 'assets/icons/info-2.svg';
			iconImg.alt = 'info';
			iconImg.style.width = '100%';
			iconImg.style.height = '100%';
			exclamationButton.appendChild(iconImg);
			exclamationButton.style.backgroundColor = backgroundColor;
			exclamationButton.onclick = (event) => {
				event.stopPropagation();
				if (tooltip.style.display === 'block') {
					tooltip.style.display = 'none';
				} else {
					iconImg.src = 'assets/icons/ring-resize.svg';
					let body = new PointKafkaBody();
					body = {
						id: idSocio,
						tipo: 'P'
					};
					this.dashboardService.postPointsKafka(body).subscribe({
						next: (response) => {
							if (response.data) {
								tooltip.innerHTML = `
								<p><strong>PG:</strong> ${response.data.compuestoTotal} pts</p>
								<p><strong>PI:</strong> ${response.data.puntajeDeLaMembresia} pts</p>
							`;
								tooltip.style.display = 'block';
							}
							else {
								tooltip.innerHTML = `
								<p><strong>PG:</strong> 0 pts</p>
								<p><strong>PI:</strong> 0 pts</p>
							`;
								tooltip.style.display = 'block';
							}
							iconImg.src = 'assets/icons/info-2.svg';
						},
						error: (err) => {
							iconImg.src = 'assets/icons/info-2.svg';
							console.error('Error al obtener datos del socio:', idSocio, err);
						},
					});
				}
			};
			document.addEventListener('click', (event) => {
				if (!exclamationButton.contains(event.target as Node)) {
					tooltip.style.display = 'none';
				}
			});
			header.appendChild(exclamationButton);
		}
		body.className =
			'py-2 px-2 rounded-bottom border border-black w-100 text-black d-flex flex-row justify-content-center align-items-center';
		
		const statusLeyend = this.leyends.find((l) => l.idState === statusId);
		const subscriptionLeyend = this.leyends.find((l) => l.idState === subscriptionStatus);
		body.textContent = subscriptionLeyend?.nameState 
			? `${statusLeyend?.nameState || 'Activo'} - ${subscriptionLeyend.nameState}`
			: statusLeyend?.nameState || 'Activo';

		container.className = 'd-flex flex-column';
		container.style.minWidth = '400px';
		container.appendChild(header);
		container.appendChild(body);
		container.appendChild(tooltip);
		if (leftLine) parent.appendChild(line.cloneNode());
		parent.appendChild(container);
		if (rightLine) parent.appendChild(line.cloneNode());
		if (backgroundColor.toUpperCase() === whiteColor) {
			header.classList.remove('text-white');
			header.classList.add('text-black');
		}
		return parent;
	}


	private generateContainer(showContainer: string = 'd-flex') {
		const container = document.createElement('div');
		container.className = `${showContainer} flex-column gap-4 hola-mundo`;
		return container;
	}

	private generateGrouper() {
		const grouper = document.createElement('div');
		grouper.className = `d-flex flex-row align-items-center w-auto`;
		return grouper;
	}

	private generateConnector(id: string) {
		const connector = document.createElement('div');
		connector.className = 'line-connector';
		connector.id = id;
		return connector;
	}
}

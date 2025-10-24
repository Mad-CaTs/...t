import { Component, Input, OnInit } from '@angular/core';
import { CardProductComponent } from './commons/components/card-product/card-product.component';
import { CommonModule } from '@angular/common';
import { CardPtosComponent } from './commons/components/card-ptos/card-ptos.component';
import { Router } from '@angular/router';
import { ProductService } from '../../commons/services/product-service.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TreeService } from 'src/app/profiles/pages/ambassador/pages/tree/commons/services/tree.service';
import { Product } from './commons/interfaces/products.interface';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { catchError, forkJoin, of } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ResortMembershipCardsComponent } from '../../../../commons/components/resort-membership-cards/resort-membership-cards.component';

@Component({
	selector: 'app-products',
	templateUrl: './my-products.component.html',
	styleUrls: ['./my-products.component.css'],
	standalone: true,
	imports: [
		CardProductComponent,
		CommonModule,
		CardPtosComponent,
		ProgressSpinnerModule,
		ReactiveFormsModule,
		InputComponent,
		SelectComponent,
		ResortMembershipCardsComponent
	],
	providers: [DialogService]
})
export default class MyProductsComponent implements OnInit {
	private ref: DynamicDialogRef;
	@Input() userId: number;
	products: Product[] = [];
	filteredProducts: Product[] = [];
	/* 	selectedProduct: any;
	 */ isLoading: boolean = false;
	stateColors: { [key: string]: string } = {};
	points: number;
	isLoadingPoints: boolean = false;
	form: FormGroup;
	membershipOptions: Array<{ content: string; value: string }> = [];
	statusOptions: Array<{ content: string; value: string }> = [];
	userStatus: string = '';
	hasProducts: boolean = false;
	@Input() fromLegalModule: boolean = false;
	rawProducts: any[] = [];
	filteredRawProducts: any[] = [];
	constructor(
		private fb: FormBuilder,
		private productService: ProductService,
		private router: Router,
		private treeService: TreeService,
		private dashboardService: DashboardService,
		private userInfoService: UserInfoService
	) {
		this.form = this.fb.group({
			searchBy: [''],
			membership: ['all'],
			status: ['all']
		});
	}

	ngOnInit(): void {
		this.loadAllData();
		this.form.valueChanges.subscribe((value) => {
			this.updateSearchAndFilters(value);
		});
		this.setUserStatus();
	}
	loadAllData(): void {
		this.isLoading = true;
		forkJoin({
			products: this.productService.getProducts().pipe(
				catchError((error) => {
					console.error('Error al cargar productos:', error);
					return of([]);
				})
			),
			colors: this.treeService.getListAllStates().pipe(
				catchError((error) => {
					console.error('Error al cargar colores:', error);
					return of([]);
				})
			),
			points: this.dashboardService.getPoints(this.userInfoService.userInfo.id).pipe(
				catchError((error) => {
					console.error('Error al cargar puntos:', error);
					this.isLoading = false;
					alert('Ocurrió un error al cargar los puntos. Intenta nuevamente.');
					return of('');
				})
			)
		}).subscribe({
			next: ({ products, colors, points }) => {
				this.rawProducts = products;

				console.log('Productos crudos desde la API:', products);
				console.log('colors:', colors);

				localStorage.setItem('products', JSON.stringify(products));
				localStorage.setItem('colors', JSON.stringify(colors));
				this.products = products.map((product) => ({
					membershipType: product.nameSuscription,
					subscriptionStatus: product.status,
					idStatus: product.idStatus,
					installmentNumber: product.numberQuotas,
					pacValue: product.volumen,
					date: product.creationDate,
					id: product.id,
					idPackageDetail: product.idPackageDetail,
					idPackage: product.idPackage,
					idFamilyPackage: product.idFamilyPackage,
					volumen: product.volumen,
					creationDate: product.creationDate,
					modificationDate: product.modificationDate,
					detailsLink: `/details/${product.id}`
				}));
				this.membershipOptions = [...new Set(this.products.map((p) => p.membershipType))].map(
					(m) => ({ content: m, value: m })
				);

				this.statusOptions = [...new Set(this.products.map((p) => p.subscriptionStatus))].map(
					(s) => ({ content: s, value: s })
				);

				/* this.membershipOptions = [
					{ content: 'Todas', value: 'all' },
					...[...new Set(this.products.map(p => p.membershipType))].map(m => ({ content: m, value: m }))
				  ];
				  
				  this.statusOptions = [
					{ content: 'Todos', value: 'all' },
					...[...new Set(this.products.map(p => p.subscriptionStatus))].map(s => ({ content: s, value: s }))
				  ]; */

				this.filteredProducts = this.products;
				console.log('Productosfiltradosiniciales:', this.filteredProducts);

				this.hasProducts = this.products.length > 0;
				this.setUserStatus();

				colors.forEach((state) => {
					this.stateColors[state.idState] = state.colorRGB;
				});

				this.points = points?.data?.puntajeDeLaMembresia ?? '0';

				/* 		  this.points = points ? points : "";
				 */
			},
			error: (error) => {
				console.error('Error al cargar los datos:', error);
				this.isLoading = false;
				alert('Ocurrio un error al cargar los datos, vuelva a intentarlo..');
			},
			complete: () => {
				this.isLoading = false;
			}
		});
	}

	setUserStatus(): void {
		const userIdStatus = this.userInfoService.userInfo.idState;
		const userProduct = this.filteredProducts.find((product) => product.idStatus === userIdStatus);
		this.userStatus = userProduct ? userProduct.subscriptionStatus : 'Estado desconocido';
	}

	updateSearchAndFilters(value: any): void {
		const { searchBy, membership, status } = value;

		// 🔹 Filtro para productos (mapeados)
		this.filteredProducts = this.products.filter((product) => {
			const matchesSearch =
				!searchBy ||
				product.membershipType.toLowerCase().includes(searchBy.toLowerCase()) ||
				product.subscriptionStatus.toLowerCase().includes(searchBy.toLowerCase());

			const matchesMembership =
				!membership || membership === 'all' || product.membershipType === membership;
			const matchesStatus = !status || status === 'all' || product.subscriptionStatus === status;

			return matchesSearch && matchesMembership && matchesStatus;
		});

		// 🔹 Filtro para legal (rawProducts)
		this.filteredRawProducts = this.rawProducts.filter((product) => {
			const matchesSearch =
				!searchBy ||
				product.nameSuscription.toLowerCase().includes(searchBy.toLowerCase()) ||
				product.status.toLowerCase().includes(searchBy.toLowerCase());

			const matchesMembership =
				!membership || membership === 'all' || product.nameSuscription === membership;
			const matchesStatus = !status || status === 'all' || product.status === status;

			return matchesSearch && matchesMembership && matchesStatus;
		});

		this.hasProducts = this.filteredProducts.length > 0;
	}

	/* updateSearchAndFilters(value: any): void {
		const { searchBy, membership, status } = value;

		this.filteredProducts = this.products.filter((product) => {
			const matchesSearch =
				!searchBy ||
				product.membershipType.toLowerCase().includes(searchBy.toLowerCase()) ||
				product.subscriptionStatus.toLowerCase().includes(searchBy.toLowerCase());

			const matchesMembership =
				!membership || membership === 'all' || product.membershipType === membership;
			const matchesStatus = !status || status === 'all' || product.subscriptionStatus === status;

			return matchesSearch && matchesMembership && matchesStatus;
		});

		this.hasProducts = this.filteredProducts.length > 0;

		
	} */

	getStatusColor(idStatus: string): { textColor: string; backgroundColor: string } {
		const colorHex = this.stateColors[idStatus] || '#000000';
		return {
			textColor: colorHex,
			backgroundColor: this.hexToRgba(colorHex, 0.2)
		};
	}

	private hexToRgba(hex: string, alpha: number): string {
		let r = parseInt(hex.slice(1, 3), 16);
		let g = parseInt(hex.slice(3, 5), 16);
		let b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	resetFilters(): void {
		this.form.reset({ searchBy: '', membership: 'all', status: 'all' });
		this.filteredProducts = this.products;
	}

	/* 	resortList = [
		{
			name: 'Inresorts Ribera del Río',
			memberships: [
				{ name: 'Vitalicia', type: 'Vitalicia', duration: 48, status: 'Activo' },
				{ name: 'Vitalicia Premium', type: 'Vitalicia Premium', duration: 48, status: 'Activo' },
				{ name: 'Experiencia', type: 'Vitalicia Premium', duration: 48, status: 'Deuda 2' }
			]
		},
		{
			name: 'Inresorts La Joya',
			memberships: [
				{ name: 'Vitalicia Family Plus', type: 'Ultra Premium', duration: 40, status: 'Inactivo' },
				{ name: 'Vitalicia La Joya', type: 'Vitalicia', duration: 60, status: 'Activo' }
			]
		}
	]; */

	recibirAccionDeNieto(event: { tipo: string; data: any }) {
		console.log('✅ Acción recibida desde el nieto:', event);

		// Guardar en sessionStorage
		sessionStorage.setItem('selectedProduct', JSON.stringify(event));

		// Navegar al panel
		this.router.navigate(['/profile/partner/my-legalization/legalization-panel', event.data.id]);
	}
}

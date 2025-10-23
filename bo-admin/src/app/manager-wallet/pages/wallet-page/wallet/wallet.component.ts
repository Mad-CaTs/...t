import { ChangeDetectorRef, Component } from '@angular/core';

/* ==== Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITableAdminWallet } from '@interfaces/manage-business.interface';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableAdminWalletMock } from '../mock';
import {
	ModalUploadWalletComponent,
	ModalWalletOperationComponent
} from '@app/manage-business/components/modals';
import { UserService } from '@app/users/services/user.service';
import { ArrayDatePipe } from '@shared/pipes/array-date.pipe';

@Component({
	selector: 'app-wallet',
	standalone: true,
	imports: [CommonModule, FormControlModule, TablesModule, ReactiveFormsModule, ArrayDatePipe],
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {
	public readonly form: FormGroup;
	public readonly table: TableModel<ITableAdminWallet>;
	isLoading: boolean = false;

	constructor(private tableService: TableService, private builder: FormBuilder, private modal: NgbModal,
		private userService: UserService, private cdr: ChangeDetectorRef,
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableAdminWallet>({
			headers: [
				'N°',
				'Fecha de registro',
				'Usuario',
				'Nombres',
				'Apellidos',
				'N° documento',
				'Email',
				'Acciones'
			]
		});
		this.table.noCheckBoxes = true;
		this.table.data = [];
		/* === Form builder === */
		this.form = builder.group({
			search: ['', [Validators.required, Validators.minLength(3)]],
			searchAs: ['1', [Validators.required]]
		});
	}

	onSearch() {
		this.isLoading = true;
		const searchValue = this.form.get('search')?.value;
		const as = this.form.get('searchAs')?.value;
		const status = '-1';
		const familyPackage = '0';
		const packagee = '0';

		this.userService.getUsersByFilter(searchValue, status, familyPackage, packagee, as).subscribe(
			(response) => {
				this.isLoading = false;
				this.table.data = response;
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching users by filter:', error);
			}
		);
	}

	/* === Events === */
	onModify(id: number) {
		const ref = this.modal.open(ModalWalletOperationComponent, { centered: true });
		const modal = ref.componentInstance as ModalWalletOperationComponent;

		modal.id = id;
	}

	onUpload() {
		this.modal.open(ModalUploadWalletComponent, { centered: true, size: 'md' });
	}
}

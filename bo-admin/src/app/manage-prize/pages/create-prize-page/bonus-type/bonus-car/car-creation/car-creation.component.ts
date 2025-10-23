import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterGenericComponent, FilterGenericConfig } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { ModalConfirmDeleteComponent } from '@shared/components/modals/modal-confirm-delete/modal-confirm-delete.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { ModalCarFormComponent } from '@app/manage-prize/components/modals/bonus-type/bonus-card/modal-car-form/modal-car-form.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { LogoSpinnerComponent } from '@shared/components/logo-spinner/logo-spinner.component';
import { handleHttpError } from '@app/event/utils/handle-http-error.util';
import { CarService } from '@app/manage-prize/services/bonus-type/bonus-car/create-card/car.service';
import { Car } from '@app/manage-prize/models/bonus-type/bonus-car/create-car/car.model';
import { catchError, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

type CarTableData = Car & {
    brandName: string;
    modelName: string;
    statusText: string;
    image: string;
    status: boolean;
    item?: number;
    paymentStartDateDisplay?: string;
};

@Component({
    selector: 'app-car-creation',
    standalone: true,
    imports: [
        CommonModule,
        FormControlModule,
        TableGenericComponent,
        FormsModule,
        ReactiveFormsModule,
        FilterGenericComponent,
        TablePaginatorComponent,
        ModalNotifyComponent,
        ModalConfirmDeleteComponent,
        ModalCarFormComponent,
        EmptyStateComponent,
        LogoSpinnerComponent
    ],
    templateUrl: './car-creation.component.html',
    styleUrls: ['./car-creation.component.scss']
})
export class CarCreationComponent implements OnInit {

    public form: FormGroup;
    selectedRowId: string | null = null;
    brandOpt: { id: string; text: string }[] = [];
    private allVehicles: CarTableData[] = [];

    showNotify = false;
    notifyTitle = '';
    notifyMessage = '';
    notifyType: 'success' | 'error' | 'info' = 'info';
    notify = {
        visible: false,
        title: '',
        message: '',
        icon: 'info' as 'success' | 'error' | 'info' | 'warning',
        oneButton: true,
        primaryText: 'Entendido',
        secondaryText: 'Cancelar',
        context: null as null | 'edit-save'
    };

    showConfirm = false;
    confirmTitle = '¿Confirmar acción?';
    confirmMessage = 'Al asignar, se le notificará y enviará al socio el cronograma de pagos de la cuota inicial. Si estás seguro, confirma la acción; de lo contrario, cancela.';
    confirmPrimaryText = 'Enviar';
    confirmSecondaryText = 'Cancelar';
    private pendingPayload: any = null;

    showDeleteModal = false;
    selectedToDelete: CarTableData | null = null;

    showCarForm = false;
    formMode: 'create' | 'edit' | 'view' = 'create';
    carFormInitialData: any = null;

    genericFilters: FilterGenericConfig[] = [
        { type: 'search', key: 'search', label: 'Buscado', order: 1, debounceMs: 400, preventLeadingSpace: true },
        { type: 'select', key: 'brand', label: 'Marca', order: 2, options: [] },
        { type: 'date', key: 'startDate', label: 'Fecha Inicio', order: 3 },
        { type: 'date', key: 'limitDate', label: 'Fecha Fin', order: 4 }
    ];
    filterValues: Record<string, any> = { search: '', brand: '', startDate: '', limitDate: '' };

    genericColumns: string[] = [
        'N°', 'Marca', 'Modelo', 'Color', 'Imagen', 'Precio del auto', 'Tasa de Interés', 'Inicial Empresa', 'Inicial Socio', 'Cuotas Fraccionadas (Inicial)', 'Cuotas', 'Fecha de Pago', 'Estado'
    ];
    genericKeys: string[] = [
        'item', 'brandName', 'modelName', 'color', 'image', 'price', 'interestRate', 'companyInitial', 'memberInitial', 'initialInstallmentsCount', 'monthlyInstallmentsCount', 'paymentStartDateDisplay', 'statusText'
    ];
    genericWidths: string[] = [
        '4%', '10%', '10%', '9%', '8%', '12%', '8%', '10%', '10%', '11%', '8%', '10%', '9%'
    ];
    genericTableData: CarTableData[] = [];
    pageSize = 8;
    pageIndex = 1;
    loading = false;

    private allAvailableBrands: Set<string> = new Set();
    private filteredVehicles: CarTableData[] = [];
    private totalElements = 0;
    private pendingNotifyData: { title: string; message: string; icon: 'success' | 'error' | 'info' | 'warning' } | null = null;

    get pagedData(): CarTableData[] {
        return this.filteredVehicles;
    }

    get totalFiltered(): number {
        return this.totalElements;
    }

    constructor(
        private builder: FormBuilder,
        private cdr: ChangeDetectorRef,
        private carService: CarService,
        private ngZone: NgZone
    ) {
        this.form = this.builder.group({
            startDate: [null],
            limitDate: [null]
        });
        this.filterValues.startDate = '';
        this.filterValues.limitDate = '';
    }

    ngOnInit(): void {
        this.loadInitialData();
        this.loadVehicles();

        this.form.controls['startDate'].valueChanges.subscribe(v => {
            this.filterValues.startDate = this.toInputDate(v as any);
            this.applyFilters();
        });
        this.form.controls['limitDate'].valueChanges.subscribe(v => {
            this.filterValues.limitDate = this.toInputDate(v as any, true);
            this.applyFilters();
        });
        setTimeout(() => {
            this.cdr.detectChanges();
        }, 100);
    }

    private loadInitialData(): void {
        const initialParams = {
            page: 0,
            size: 100
        };

        this.carService.searchDetails(initialParams).pipe(
            tap((response: any) => {
                if (response.result && response.data) {
                    const allCars = response.data.content.map((item: any) => this.mapApiResponseToVehicle(item));

                    allCars.forEach((vehicle: CarTableData) => {
                        if (vehicle.brandName) {
                            this.allAvailableBrands.add(vehicle.brandName);
                        }
                    });

                    const brandNames = Array.from(this.allAvailableBrands).sort();
                    this.genericFilters = this.genericFilters.map(filter => {
                        if (filter.key === 'brand') {
                            return { ...filter, options: brandNames };
                        }
                        return filter;
                    });
                    this.cdr.detectChanges();
                }
            }),
            catchError((error) => {
                return of(null);
            })
        ).subscribe();
    }

    private loadVehicles(): void {
        this.searchVehicles();
    }

    private searchVehicles(): void {
        const params: Record<string, any> = {};

        const search = (this.filterValues.search || '').toString().trim();
        const brand = (this.filterValues.brand || '').toString().trim();
        const startDate = this.filterValues.startDate;
        const endDate = this.filterValues.limitDate;
        if (brand) {
            params.brandName = brand;
        } else if (search) {
            params.brandName = search;
        }

        if (startDate) {
            params.startDate = startDate;
        }
        if (endDate) {
            params.endDate = endDate;
        }

        params.page = this.pageIndex - 1;
        params.size = this.pageSize;

        this.carService.searchDetails(params).pipe(
            tap((response: any) => {
                if (response.result && response.data) {
                    this.allVehicles = response.data.content.map((item: any) => this.mapApiResponseToVehicle(item));
                    this.filteredVehicles = this.allVehicles.slice();
                    this.totalElements = response.data.totalElements;
                    this.genericTableData = this.filteredVehicles;
                    this.updateBrandOptions();
                    this.cdr.detectChanges();

                    setTimeout(() => {
                        this.genericTableData = [...this.filteredVehicles];
                        this.cdr.detectChanges();
                    }, 100);
                }
            }),
            catchError((error) => {
                const errorInfo = handleHttpError(error);
                this.openInfo(errorInfo.notifyTitle, errorInfo.notifyMessage, 'error');
                this.allVehicles = [];
                this.filteredVehicles = [];
                this.genericTableData = [];
                this.totalElements = 0;
                return of(null);
            })
        ).subscribe(() => {
            this.cdr.detectChanges();
        });
    }

    private mapApiResponseToVehicle(apiItem: any): CarTableData {
        const baseCar: Car = {
            id: apiItem.carAssignmentId,
            memberId: apiItem.memberId,
            brandId: apiItem.brand.id,
            modelId: apiItem.model.id,
            color: apiItem.color,
            imageUrl: apiItem.imageUrl,
            price: apiItem.price,
            interestRate: apiItem.interestRate,
            companyInitial: apiItem.companyInitial,
            memberInitial: apiItem.memberInitial,
            initialInstallmentsCount: apiItem.initialInstallmentsCount,
            monthlyInstallmentsCount: apiItem.monthlyInstallmentsCount,
            paymentStartDate: apiItem.paymentStartDate,
            statusId: apiItem.isAssigned ? 1 : 0,
            assignedDate: apiItem.assignedDate
        };

        const hasMember = apiItem.memberId != null && Number(apiItem.memberId) > 0;
        const statusValue = !!hasMember;

        return {
            ...baseCar,
            brandName: apiItem.brand.name,
            modelName: apiItem.model.name,
            image: apiItem.imageUrl || '',
            statusText: this.getStatusText(apiItem.statusId, apiItem.memberId),
            status: statusValue,
            paymentStartDateDisplay: this.toDisplayDate(apiItem.paymentStartDate)
        };
    }

    private toDisplayDate(dateStr?: string | null): string {
        if (!dateStr) return '';
        const d = dateStr.split('T')[0];
        const parts = d.split('-');
        if (parts.length === 3) {
            const [yyyy, mm, dd] = parts;
            return `${dd}/${mm}/${yyyy}`;
        }
        try {
            const dt = new Date(dateStr);
            const day = String(dt.getUTCDate()).padStart(2, '0');
            const mon = String(dt.getUTCMonth() + 1).padStart(2, '0');
            const yr = dt.getUTCFullYear();
            return `${day}/${mon}/${yr}`;
        } catch {
            return dateStr;
        }
    }

    private getStatusText(statusId: number, memberId: number | null): string {
        const hasMember = memberId != null && Number(memberId) > 0;
        if (hasMember) return 'Asignado';
        return 'Disponible';
    }

    private updateBrandOptions(): void {
        if (this.allVehicles && this.allVehicles.length > 0) {
            this.allVehicles.forEach(vehicle => {
                if (vehicle.brandName) {
                    this.allAvailableBrands.add(vehicle.brandName);
                }
            });
        }

        const brandNames = Array.from(this.allAvailableBrands).sort();

        if (brandNames.length > 0) {
            this.genericFilters = this.genericFilters.map(filter => {
                if (filter.key === 'brand') {
                    return { ...filter, options: brandNames };
                }
                return filter;
            });

            this.brandOpt = brandNames.map((brandName, index) => ({
                id: (index + 1).toString(),
                text: brandName
            }));
            this.cdr.detectChanges();
        }
    }

    getBrandName(brandId?: number): string {
        const brandMap: { [key: number]: string } = {
            1: 'Toyota',
            2: 'Honda',
            3: 'Ford'
        };
        return brandId ? (brandMap[brandId] || 'Marca desconocida') : 'Sin marca';
    }

    getModelName(modelId?: number): string {
        const modelMap: { [key: number]: string } = {
            1: 'Corolla',
            2: 'Camry',
            3: 'Civic',
            4: 'Accord',
            5: 'Focus',
            6: 'Fiesta'
        };
        return modelId ? (modelMap[modelId] || 'Modelo desconocido') : 'Sin modelo';
    }

    public onGenerate() {
        this.formMode = 'create';
        this.carFormInitialData = null;
        this.showCarForm = true;
        this.cdr.detectChanges();
    }

    public onRowSelect(id: string): void {
        this.selectedRowId = id;
        this.cdr.detectChanges();
    }

    onFiltersChange(values: Record<string, any>) {
        const keys = this.genericFilters.map(f => f.key);
        const next: Record<string, any> = {};
        for (const k of keys) {
            next[k] = Object.prototype.hasOwnProperty.call(values, k)
                ? (values as any)[k] ?? ''
                : '';
        }
        this.filterValues = next;

        const sd = this.filterValues.startDate;
        const ld = this.filterValues.limitDate;
        this.form.controls['startDate'].setValue(sd ? new Date(sd) : null, { emitEvent: false });
        this.form.controls['limitDate'].setValue(ld ? new Date(ld) : null, { emitEvent: false });

        this.applyFilters();
        this.cdr.detectChanges();
    }

    private applyFilters() {
        this.pageIndex = 1;
        this.searchVehicles();
        setTimeout(() => {
            this.genericTableData = this.filteredVehicles;
            this.cdr.detectChanges();
        }, 50);
    }

    onPageChange(pageIndex: number) {
        this.pageIndex = pageIndex;
        this.searchVehicles();
        this.cdr.detectChanges();
    }

    onPageSizeChange(pageSize: number) {
        this.pageSize = pageSize;
        this.pageIndex = 1;
        this.searchVehicles();
        this.cdr.detectChanges();
    }

    private parseInputDate(value: any, endOfDay = false): Date | null {
        if (!value) return null;
        const d = value instanceof Date ? new Date(value) : new Date(value);
        if (isNaN(d.getTime())) return null;
        if (endOfDay) d.setHours(23, 59, 59, 999); else d.setHours(0, 0, 0, 0);
        return d;
    }

    private toInputDate(d: Date, endOfDay = false): string {
        if (!(d instanceof Date) || isNaN(d.getTime())) return '';
        const copy = new Date(d.getTime());
        if (endOfDay) copy.setHours(23, 59, 59, 999); else copy.setHours(0, 0, 0, 0);
        const yyyy = copy.getFullYear();
        const mm = String(copy.getMonth() + 1).padStart(2, '0');
        const dd = String(copy.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    public onEdit() {
        const selectedItem = (this.filteredVehicles || []).find((item) => item.id === this.selectedRowId);
        if (!selectedItem) return;

        this.formMode = 'edit';
        this.carFormInitialData = {
            id: selectedItem.id,
            brand: selectedItem.brandName,
            model: selectedItem.modelName,
            brandId: selectedItem.brandId,
            modelId: selectedItem.modelId,
            color: selectedItem.color,
            price: selectedItem.price,
            interestRate: selectedItem.interestRate,
            companyInitialAmount: selectedItem.companyInitial,
            partnerInitialAmount: selectedItem.memberInitial,
            installmentQuantity: selectedItem.monthlyInstallmentsCount,
            fractionQuantity: selectedItem.initialInstallmentsCount ?? 0,
            image: selectedItem.imageUrl ? { name: 'Imagen', url: selectedItem.imageUrl, isUrl: true } as any : null,
            paymentDate: selectedItem.paymentStartDate,
            statusId: selectedItem.statusId,
            memberId: selectedItem.memberId
        };
        this.showCarForm = true;
        this.cdr.detectChanges();
    }

    onEditRow(row: any) {
        this.selectedRowId = row?.id ?? null;
        this.onEdit();
    }

    onEditAsignacion(row: any) {
        if (!row) return;
        const item = (this.filteredVehicles || []).find((r) => r.id === (row?.id ?? row));
        if (!item) return;

        this.formMode = 'edit';
        this.carFormInitialData = {
            id: item.id,
            brand: item.brandName,
            model: item.modelName,
            brandId: item.brandId,
            modelId: item.modelId,
            color: item.color,
            price: item.price,
            interestRate: item.interestRate,
            companyInitialAmount: item.companyInitial,
            partnerInitialAmount: item.memberInitial,
            installmentQuantity: item.monthlyInstallmentsCount,
            fractionQuantity: item.initialInstallmentsCount ?? 0,
            image: item.imageUrl ? { name: 'Imagen', url: item.imageUrl, isUrl: true } as any : null,
            paymentDate: item.paymentStartDate,
            statusId: item.statusId,
            memberId: item.memberId
        };
        this.showCarForm = true;
        this.cdr.detectChanges();
    }

    onDeleteRow(row: any) {
        if (!row) return;
        this.onDelete(row.id);
    }

    onViewRow(row: any) {
        const id = row?.id ?? row;
        if (!id) return;
        this.fetchCarDetailsAndOpen(id as string, 'view');
    }

    private openInfo(title: string, message: string, icon: 'success' | 'error' | 'info' | 'warning' = 'info') {
        this.notify = {
            visible: true,
            title,
            message,
            icon,
            oneButton: true,
            primaryText: 'Entendido',
            secondaryText: 'Cancelar',
            context: null
        };
    }

    private openConfirmEdit() {
        this.confirmTitle = '¿Confirmar acción?';
        this.confirmMessage = 'Al asignar, se le notificará y enviará al socio el cronograma de pagos de la cuota inicial. Si estás seguro, confirma la acción; de lo contrario, cancela.';
        this.confirmPrimaryText = 'Enviar';
        this.confirmSecondaryText = 'Cancelar';

        this.notify = {
            visible: true,
            title: this.confirmTitle,
            message: this.confirmMessage,
            icon: 'warning',
            oneButton: false,
            primaryText: this.confirmPrimaryText,
            secondaryText: this.confirmSecondaryText,
            context: 'edit-save'
        };
    }

    onNotifyConfirmed(): void {
        if (this.notify.context === 'edit-save') {
            this.applyEditSaveFromPending();
            return;
        }
        this.notify.visible = false;
        this.cdr.detectChanges();
    }

    onNotifyCanceled(): void {
        this.pendingPayload = null;
        this.notify.visible = false;
        this.cdr.detectChanges();
    }

    onNotifyClosed(): void {
        this.notify.visible = false;
        this.cdr.detectChanges();
    }

    public onCloseCarForm(): void {
        this.showCarForm = false;
        this.carFormInitialData = null;
        this.formMode = 'create';
        this.genericTableData = this.filteredVehicles;
        this.cdr.detectChanges();
    }

    public onSaveCarForm(payload: any): void {
        if (this.formMode === 'create') {
            const formData = new FormData();
            formData.append('brandId', payload.brandId?.toString() || '');
            formData.append('modelId', payload.modelId?.toString() || '');
            formData.append('color', payload.color || '');
            formData.append('price', payload.price?.toString() || '');
            formData.append('interestRate', payload.interestRate?.toString() || '');
            formData.append('companyInitial', payload.companyInitialAmount?.toString() || '');
            formData.append('memberInitial', payload.partnerInitialAmount?.toString() || '');
            formData.append('initialInstallmentsCount', payload.initialInstallmentsCount?.toString() || '0');
            formData.append('monthlyInstallmentsCount', payload.monthlyInstallmentsCount?.toString() || '0');
            formData.append('paymentStartDate', payload.paymentDate || '');

            if (payload.image && payload.image instanceof File) {
                formData.append('image', payload.image);
            }
            const memberIdToSend = payload.memberId != null ? payload.memberId : (this.carFormInitialData?.memberId ?? null);
            if (memberIdToSend != null) {
                formData.append('memberId', memberIdToSend.toString());
            }

            this.loading = true;
            this.cdr.detectChanges();

            this.carService.createCar(formData).pipe(
                finalize(() => {
                    this.ngZone.run(() => {
                        this.loading = false;
                        this.cdr.detectChanges();
                    });
                    setTimeout(() => {
                        if (this.pendingNotifyData) {
                            const { title, message, icon } = this.pendingNotifyData;
                            this.openInfo(title, message, icon);
                            this.pendingNotifyData = null;
                            this.cdr.detectChanges();
                        }
                    }, 350);
                }),
                tap(() => {
                    this.pendingNotifyData = { title: 'Éxito', message: 'Auto creado exitosamente', icon: 'success' };
                    this.onCloseCarForm();
                    this.loadVehicles();
                }),
                catchError((error) => {
                    const errorInfo = handleHttpError(error);
                    this.pendingNotifyData = { title: errorInfo.notifyTitle, message: errorInfo.notifyMessage, icon: errorInfo.notifyType } as any;
                    return of(null);
                })
            ).subscribe();
            return;
        }

        if (this.formMode === 'edit') {
            this.pendingPayload = payload;
            this.openConfirmEdit();
            this.cdr.detectChanges();
            return;
        }
    }

    private generateUniqueId(): string {
        return 'car_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    private applyEditSaveFromPending(): void {
        if (!this.pendingPayload) { this.notify.visible = false; return; }

        const payload = this.pendingPayload;
        this.pendingPayload = null;
        this.notify.visible = false;

        const id = this.carFormInitialData?.id as string;
        const prev = this.allVehicles.find(v => v.id === id);

        const formData = new FormData();
        formData.append('brandId', (payload.brandId || prev?.brandId || '').toString());
        formData.append('modelId', (payload.modelId || prev?.modelId || '').toString());
        formData.append('color', payload.color || '');
        formData.append('price', (payload.price ?? prev?.price ?? '').toString());
        formData.append('interestRate', (payload.interestRate ?? prev?.interestRate ?? '').toString());
        formData.append('companyInitial', (payload.companyInitialAmount ?? prev?.companyInitial ?? '').toString());
        formData.append('memberInitial', (payload.partnerInitialAmount ?? prev?.memberInitial ?? '').toString());
        formData.append('initialInstallmentsCount', (payload.initialInstallmentsCount ?? prev?.initialInstallmentsCount ?? 0).toString());
        formData.append('monthlyInstallmentsCount', (payload.monthlyInstallmentsCount ?? prev?.monthlyInstallmentsCount ?? 0).toString());
        formData.append('paymentStartDate', (payload.paymentDate ?? prev?.paymentStartDate ?? '').toString());
        const memberIdToSend = payload.memberId != null ? payload.memberId : (this.carFormInitialData?.memberId ?? null);
        if (memberIdToSend != null) {
            formData.append('memberId', memberIdToSend.toString());
        }
        if (payload.image && payload.image instanceof File) {
            formData.append('image', payload.image);
        }

        this.loading = true;
        this.cdr.detectChanges();

        this.carService.updateCar(id, formData).pipe(
            finalize(() => {
                this.ngZone.run(() => {
                    this.loading = false;
                    this.cdr.detectChanges();
                });
                setTimeout(() => {
                    if (this.pendingNotifyData) {
                        const { title, message, icon } = this.pendingNotifyData;
                        this.openInfo(title, message, icon);
                        this.pendingNotifyData = null;
                        this.cdr.detectChanges();
                    }
                }, 350);
            }),
            tap((resp: any) => {
                if (resp?.result === true && resp?.data) {
                    this.pendingNotifyData = { title: 'Actualizado', message: 'El auto ha sido actualizado correctamente.', icon: 'success' };
                    this.onCloseCarForm();
                    this.loadVehicles();
                } else {
                    this.pendingNotifyData = { title: 'Error', message: 'No se pudo actualizar el auto.', icon: 'error' };
                }
            }),
            catchError((error) => {
                const errorInfo = handleHttpError(error);
                this.pendingNotifyData = { title: errorInfo.notifyTitle, message: errorInfo.notifyMessage, icon: errorInfo.notifyType } as any;
                return of(null);
            })
        ).subscribe(() => {
            this.cdr.detectChanges();
        });
    }

    private decorateGeneric(data: any[], startIndex: number = 0): any[] {
        return data.map((v, idx) => ({
            ...v,
            item: startIndex + idx + 1,
            statusText: v.statusText || (v.status ? 'Asignado' : 'Sin asignar'),
        }));
    }

    public onDelete(id: string) {
        this.selectedToDelete = this.allVehicles.find(v => v.id === id) ?? null;
        this.showDeleteModal = true;
        this.cdr.detectChanges();
    }

    public onConfirmDelete(): void {
        if (!this.selectedToDelete) return;
        const id = this.selectedToDelete.id as string;
        const b = this.selectedToDelete.brandName || this.getBrandName(this.selectedToDelete.brandId);
        const m = this.selectedToDelete.modelName || this.getModelName(this.selectedToDelete.modelId);
        const successMsg = `El carro ${b} ${m} ha sido eliminado correctamente`;

        this.showDeleteModal = false;
        this.loading = true;
        this.cdr.detectChanges();

        this.carService.deleteCar(id).pipe(
            finalize(() => {
                this.ngZone.run(() => {
                    this.loading = false;
                    this.cdr.detectChanges();
                });
                setTimeout(() => {
                    if (this.pendingNotifyData) {
                        const { title, message, icon } = this.pendingNotifyData;
                        this.openInfo(title, message, icon);
                        this.pendingNotifyData = null;
                        this.cdr.detectChanges();
                    }
                }, 300);
            }),
            tap((resp: any) => {
                const ok = (resp && (resp.success === true || resp.result === true));
                if (ok) {
                    this.allVehicles = this.allVehicles.filter(item => item.id !== id);
                    this.filteredVehicles = this.allVehicles.slice();
                    this.genericTableData = this.filteredVehicles;
                    if (this.selectedRowId === id) this.selectedRowId = null;
                    this.updateBrandOptions();
                    this.applyFilters();
                    this.pendingNotifyData = { title: 'Eliminado', message: successMsg, icon: 'success' };
                    this.loadVehicles();
                } else {
                    this.pendingNotifyData = { title: 'Error', message: 'No se pudo eliminar el auto.', icon: 'error' };
                }
            }),
            catchError((error) => {
                const errorInfo = handleHttpError(error);
                this.pendingNotifyData = { title: errorInfo.notifyTitle, message: errorInfo.notifyMessage, icon: errorInfo.notifyType } as any;
                return of(null);
            })
        ).subscribe({
            complete: () => {
                this.selectedToDelete = null;
                this.cdr.detectChanges();
            }
        });
    }
    public onCancelDelete(): void {
        this.selectedToDelete = null;
        this.showDeleteModal = false;
        this.cdr.detectChanges();
    }

    private fetchCarDetailsAndOpen(id: string, mode: 'view' | 'edit' = 'view'): void {
        this.loading = true;
        this.cdr.detectChanges();
        this.carService.getDetailsById(id).pipe(
            finalize(() => {
                this.ngZone.run(() => {
                    this.loading = false;
                    this.cdr.detectChanges();
                });
                setTimeout(() => {
                    if (this.pendingNotifyData) {
                        const { title, message, icon } = this.pendingNotifyData;
                        this.openInfo(title, message, icon);
                        this.pendingNotifyData = null;
                        this.cdr.detectChanges();
                    }
                }, 300);
            }),
            tap((resp: any) => {
                if (resp?.result && resp?.data) {
                    const d = resp.data;
                    this.formMode = mode;
                    this.carFormInitialData = {
                        id: d.id,
                        brandId: d.brand?.id ?? null,
                        modelId: d.model?.id ?? null,
                        brand: d.brand?.name ?? '',
                        model: d.model?.name ?? '',
                        color: d.color,
                        price: d.price,
                        interestRate: d.interestRate,
                        companyInitialAmount: d.companyInitial,
                        partnerInitialAmount: d.memberInitial,
                        installmentQuantity: d.monthlyInstallmentsCount,
                        fractionQuantity: d.initialInstallmentsCount ?? 0,
                        image: d.imageUrl ? { name: 'Imagen', url: d.imageUrl, isUrl: true } as any : null,
                        paymentDate: d.paymentStartDate,
                        statusId: d.statusId,
                        memberId: d.memberId
                    } as any;
                    this.showCarForm = true;
                    this.cdr.detectChanges();
                } else {
                    this.pendingNotifyData = { title: 'Error', message: 'No se pudo cargar el detalle del auto.', icon: 'error' };
                }
            }),
            catchError((error) => {
                const errorInfo = handleHttpError(error);
                this.pendingNotifyData = { title: errorInfo.notifyTitle, message: errorInfo.notifyMessage, icon: errorInfo.notifyType } as any;
                return of(null);
            })
        ).subscribe();
    }
    public onNotifyClose(): void {
        this.showNotify = false;
        this.cdr.detectChanges();
    }
}

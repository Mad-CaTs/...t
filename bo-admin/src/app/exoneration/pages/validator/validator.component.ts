import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RentExemptionUserSearchRequest } from '@app/exoneration/models/rent-exemption-user-search-request';
import { RentExemptionService } from '@app/exoneration/services/rent-exemption.service';
import { ISelectOpt } from '@interfaces/form-control.interface';

@Component({
    selector: 'app-exoneration-validator',
    templateUrl: './validator.component.html',
    styleUrls: [],
})
export class ValidatorComponent {
    data: any[] = [];
    refresh: boolean = false;
    totalRecords: number = 0;
    form: FormGroup;
    buttonLoading: boolean = false;
    size: number = 10;
    page: number = 0;
    asOpt: ISelectOpt[] = [
        { id: "1", text: 'Usuario' },
        { id: "2", text: 'Patrocinador' }
    ];

    constructor(
        private formBuilder: FormBuilder,
        private rentExemptionService: RentExemptionService,
        private cdr: ChangeDetectorRef,
    ) {
        this.form = this.formBuilder.group({
            username: [''],
            familyPackage: [0],
            packageDetail: [0],
            typeUser: [1],
            status: [[3]],
        });
    }


    ngOnInit(): void {

    }

    onSearch(flag?: boolean) {
        this.buttonLoading = true;
        this.refresh = false;
        if (!flag) {
            this.page = 0;
            this.refresh = true;
        }
        const pagination: RentExemptionUserSearchRequest = {
            ...this.form.value,
            size: this.size,
            page: this.page,
        };
        this.rentExemptionService.getRentExemptionByStatus(pagination).subscribe({
            next: (response) => {
                this.data = response.data;
                this.totalRecords = response.total;
                this.buttonLoading = false;
                this.cdr.detectChanges();
            }, error: (error) => {
                alert(error);
            }
        });
    }

    onPageChange(event: any) {
        this.page = event - 1;
        this.onSearch(true);
    }

}
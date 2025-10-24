import { Injectable } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Injectable()
export class ModalBeneficiaryPresenter {
    public beneficiaryForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.beneficiaryForm = this.fb.group({
            userId: [''],
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            gender: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            documentId: ['', Validators.required],
            nroDocument: ['', Validators.required],
            residenceCountryId: ['', Validators.required],
            ageDate: ['', Validators.required]
        });
    }
}

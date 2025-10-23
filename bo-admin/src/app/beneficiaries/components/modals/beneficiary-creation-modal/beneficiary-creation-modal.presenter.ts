import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class ModalBeneficiaryPresenter {

    public beneficiaryForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.beneficiaryForm = this.fb.group({
            userId: [''],
            idSubscription: ['', Validators.required],
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            gender: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            documentId: ['', Validators.required],
            nroDocument: ['', Validators.required],
            residenceCountryId: ['', Validators.required],
            ageDate: [null, Validators.required]
        });
    }

}
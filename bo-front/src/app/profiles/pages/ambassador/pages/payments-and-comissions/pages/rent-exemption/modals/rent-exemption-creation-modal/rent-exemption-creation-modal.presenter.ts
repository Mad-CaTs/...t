import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ModalRentExemptionPresenter {
    public rentExemptionForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.rentExemptionForm = this.fb.group({
            number: ['', Validators.required],
            date: [new Date().toUTCString(), Validators.required],
            nroDocument: ['', Validators.required],
            noteAditional: ['', Validators.required],
            amount: [null, [Validators.required, Validators.min(1)]],
            file: ['', Validators.required]
        });
    }
}

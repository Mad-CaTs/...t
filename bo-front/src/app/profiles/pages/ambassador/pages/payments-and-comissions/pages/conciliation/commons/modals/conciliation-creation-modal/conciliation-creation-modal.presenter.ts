import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ModalConciliationPresenter {
    public conciliationForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.conciliationForm = this.fb.group({
            number: ['', Validators.required],
            date: ['', Validators.required],
            currency: ['', Validators.required],
            documentType: ['', Validators.required],
            noteAditional: ['', Validators.required],
            amount: [null, [Validators.required, Validators.min(1)]],
            file: ['', Validators.required],
            detraction: [],
            detractionValue: [],
            rent: [],
            rentValue: []
        });
    }
}

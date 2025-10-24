import { Injectable } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Injectable()
export class ModalProspectPresenter {
    public prospectForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.prospectForm = this.fb.group({
            userId: [''],
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            gender: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            documentId: ['', Validators.required],
            nroDocument: ['', Validators.required],
            nroPhone: ['', Validators.required],
            prospectType: ['', Validators.required],
            residenceCountryId: ['', Validators.required],
        });
    }
}

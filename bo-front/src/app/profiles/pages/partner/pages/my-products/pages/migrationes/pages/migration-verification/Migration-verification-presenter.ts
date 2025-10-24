import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class MigrationVerificationPresenter {
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
/*       totalNumberPaymentPaid: [1, Validators.required],
 */
      totalNumberPaymentPaid: new FormControl({ value: 0,disabled:false}),
      payType: new FormControl(null),
      payType1: new FormControl(null),

     numberPaymentInitials: new FormControl({ value: null, disabled: true }),
      amount1: new FormControl({ value: null, disabled: true }),
      amount2: new FormControl({ value: null, disabled: true }), 
      amount3: new FormControl({ value: null, disabled: true }), 
      amountPaid: [null, Validators.required],

    });
  }


  public updatePaymentType(option: number): void {
    if (option === 2) { 
/*       this.form.get('numberPaymentInitials')?.enable();
 *//*       this.form.get('amount1')?.enable();
      this.form.get('amount2')?.enable();
      this.form.get('amount3')?.enable(); */
    } else { 
     /*  this.form.get('numberPaymentInitials')?.disable(); */
    /*   this.form.get('amount1')?.disable();
      this.form.get('amount2')?.disable();
      this.form.get('amount3')?.disable(); */

      

    }
  }
}

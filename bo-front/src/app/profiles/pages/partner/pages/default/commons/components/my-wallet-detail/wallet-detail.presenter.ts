import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class WalletDetailPresenter {
  constructor(private fb: FormBuilder) { }

  buildForm(): FormGroup {
    return this.fb.group({
      user: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(0.01)]]
    });
  }
}

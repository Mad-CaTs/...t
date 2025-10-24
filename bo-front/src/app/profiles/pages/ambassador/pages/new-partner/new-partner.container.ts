import { Component } from '@angular/core';
import NewPartnerComponent from './new-partner.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-new-partner',
	standalone: true,
	imports: [NewPartnerComponent],
	templateUrl: './new-partner.container.html',
	styleUrls: ['./new-partner.container.scss']
})
export default class NewPartnerContainer {
  myForm: FormGroup;

	constructor() {}

	ngOnInit(): void {
    this.myForm = new FormGroup({
      exampleControl: new FormControl('')  
    });
  }
}

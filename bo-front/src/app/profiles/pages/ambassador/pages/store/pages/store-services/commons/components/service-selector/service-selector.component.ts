import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { MockService } from '../../../../../commons/mocks/mock';

@Component({
	selector: 'app-service-selector',
	standalone: true,
	imports: [CommonModule, RadiosComponent, MatCheckboxModule, MatIconModule, NgbAccordionModule],
	templateUrl: './service-selector.component.html',
	styleUrl: './service-selector.component.scss'
})
export default class ServiceSelectorComponent implements OnInit {
  formattedServices: any[] = [];
	showPromotionalCode = true;
  services: any[] = [];
  form: FormGroup;

  constructor(private mockService: MockService, private fb: FormBuilder) {
    this.form = this.fb.group({
      serviceDetailId: ['']
    });
   }


   

   ngOnInit(): void {
   this.loadServices()
  }

  private loadServices(): void {
    this.mockService.getServices().subscribe(data => {
      this.services = data;
    });
  }



    getForm(form: string) {
      return this.form.get(form);
    } 

    onServiceSelection(value: any): void {
      this.form.get('serviceDetailId')?.setValue(value);
    }

  

}

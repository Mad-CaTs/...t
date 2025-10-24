import { Component } from '@angular/core';
import  NewPartnerComponent from '../new-partner/new-partner.component';

@Component({
  selector: 'app-new-partner-temporal',
  standalone: true,
  imports: [
    NewPartnerComponent,
  ],
  templateUrl: './new-partner-temporal.component.html',
  styleUrl: './new-partner-temporal.component.scss'
})
export default  class NewPartnerTemporalComponent {

	ngOnInit(): void {}
}

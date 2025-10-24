import { Component } from '@angular/core';
import { StatComponent } from '../stat/stat.component';

@Component({
  selector: 'app-additional-information',
  standalone: true,
  imports: [StatComponent],
  templateUrl: './additional-information.component.html',
  styleUrl: './additional-information.component.scss'
})
export class AdditionalInformationComponent {

}

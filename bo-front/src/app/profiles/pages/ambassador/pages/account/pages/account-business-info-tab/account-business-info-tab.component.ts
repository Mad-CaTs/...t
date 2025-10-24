import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { nationalitiesOptMock } from '../../../../commons/mocks/mock-personal-information';
import { SelectComponent } from '@shared/components/form-control/select/select.component';

@Component({
  selector: 'app-account-business-info-tab',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectComponent],
  templateUrl: './account-business-info-tab.component.html',
  styleUrls: [],
})
export class AccountBusinessInfoTabComponent {
  public countryControl = new FormControl(1);
  public countryOpt = nationalitiesOptMock;
}

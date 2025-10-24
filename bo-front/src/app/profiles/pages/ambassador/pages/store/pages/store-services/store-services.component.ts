import { Component, EventEmitter, Output } from '@angular/core';
import { Section } from '../store-packages/commons/enums';
import { CommonModule } from '@angular/common';
import ServiceSelectorComponent from './commons/components/service-selector/service-selector.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
  selector: 'app-store-services',
  standalone: true,
  imports: [CommonModule,ServiceSelectorComponent],
  templateUrl: './store-services.component.html',
  styleUrl: './store-services.component.scss'
})
export default class StoreServicesComponent {
  @Output() prevState = new EventEmitter();

  currentSection: Section = Section.FIRST_PACKAGE;
  Section = Section;
  public disabledUser: boolean = this.userInfoService.disabled;

  constructor(
    public userInfoService: UserInfoService
  ) { }

  goToNextSection(): void {
		if (this.currentSection === Section.FIRST_PACKAGE) {
		} else {
			this.currentSection = Section.FIRST_PACKAGE;
		}
	}

  goBack(): void {
      this.currentSection = Section.FIRST;
  }
    

}

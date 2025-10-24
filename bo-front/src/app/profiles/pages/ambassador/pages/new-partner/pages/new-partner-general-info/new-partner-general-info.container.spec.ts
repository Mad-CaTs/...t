import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPartnerGeneralInfoComponent } from './new-partner-general-info.component';

describe('NewPartnerGeneralInfoComponent', () => {
  let component: NewPartnerGeneralInfoComponent;
  let fixture: ComponentFixture<NewPartnerGeneralInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewPartnerGeneralInfoComponent]
    });
    fixture = TestBed.createComponent(NewPartnerGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

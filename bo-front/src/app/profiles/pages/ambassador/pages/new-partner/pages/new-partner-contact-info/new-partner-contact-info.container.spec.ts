import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPartnerContactInfoComponent } from './new-partner-contact-info.component';

describe('NewPartnerContactInfoComponent', () => {
  let component: NewPartnerContactInfoComponent;
  let fixture: ComponentFixture<NewPartnerContactInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewPartnerContactInfoComponent]
    });
    fixture = TestBed.createComponent(NewPartnerContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

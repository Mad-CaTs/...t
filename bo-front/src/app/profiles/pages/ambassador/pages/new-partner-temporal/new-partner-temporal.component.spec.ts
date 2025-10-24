import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPartnerTemporalComponent } from './new-partner-temporal.component';

describe('NewPartnerTemporalComponent', () => {
  let component: NewPartnerTemporalComponent;
  let fixture: ComponentFixture<NewPartnerTemporalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPartnerTemporalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPartnerTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

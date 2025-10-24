import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailSponsorshipListComponent } from './modal-detail-sponsorship-list.component';

describe('ModalDetailSponsorshipListComponent', () => {
  let component: ModalDetailSponsorshipListComponent;
  let fixture: ComponentFixture<ModalDetailSponsorshipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetailSponsorshipListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalDetailSponsorshipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorshipListComponent } from './sponsorship-list.component';

describe('SponsorshipListComponent', () => {
  let component: SponsorshipListComponent;
  let fixture: ComponentFixture<SponsorshipListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SponsorshipListComponent]
    });
    fixture = TestBed.createComponent(SponsorshipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

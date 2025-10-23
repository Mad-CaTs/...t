import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixDataModalComponent } from './fix-data-modal.component';

describe('FixDataModalComponent', () => {
  let component: FixDataModalComponent;
  let fixture: ComponentFixture<FixDataModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FixDataModalComponent]
    });
    fixture = TestBed.createComponent(FixDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

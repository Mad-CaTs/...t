import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAllnearExpirationComponent } from './modal-allnear-expiration.component';

describe('ModalAllnearExpirationComponent', () => {
  let component: ModalAllnearExpirationComponent;
  let fixture: ComponentFixture<ModalAllnearExpirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAllnearExpirationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalAllnearExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

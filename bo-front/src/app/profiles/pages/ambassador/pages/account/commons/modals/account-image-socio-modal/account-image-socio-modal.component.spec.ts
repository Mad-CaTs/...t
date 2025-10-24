import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountImageSocioModalComponent } from './account-image-socio-modal.component';

describe('AccountImageSocioModalComponent', () => {
  let component: AccountImageSocioModalComponent;
  let fixture: ComponentFixture<AccountImageSocioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountImageSocioModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountImageSocioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

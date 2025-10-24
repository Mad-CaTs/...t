import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSocioModalComponent } from './account-socio-modal.component';

describe('AccountSocioModalComponent', () => {
  let component: AccountSocioModalComponent;
  let fixture: ComponentFixture<AccountSocioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSocioModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountSocioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

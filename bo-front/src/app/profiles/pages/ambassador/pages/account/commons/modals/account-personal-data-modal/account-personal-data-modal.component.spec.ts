import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPersonalDataModalComponent } from './account-personal-data-modal.component';

describe('AccountPersonalDataModalComponent', () => {
  let component: AccountPersonalDataModalComponent;
  let fixture: ComponentFixture<AccountPersonalDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountPersonalDataModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountPersonalDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

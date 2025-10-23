import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicWalletComponent } from './electronic-wallet.component';

describe('ElectronicWalletComponent', () => {
  let component: ElectronicWalletComponent;
  let fixture: ComponentFixture<ElectronicWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ElectronicWalletComponent]
    });
    fixture = TestBed.createComponent(ElectronicWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

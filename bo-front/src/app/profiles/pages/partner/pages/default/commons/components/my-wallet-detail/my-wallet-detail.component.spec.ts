import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWalletDetailComponent } from './my-wallet-detail.component';

describe('MyWalletDetailComponent', () => {
  let component: MyWalletDetailComponent;
  let fixture: ComponentFixture<MyWalletDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyWalletDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyWalletDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

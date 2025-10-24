import { ComponentFixture, TestBed } from '@angular/core/testing';
import PrimaryAndSecondaryComponent from './primary-and-secondary-profile.component';


describe('PrimaryAndSecondaryComponent', () => {
  let component: PrimaryAndSecondaryComponent;
  let fixture: ComponentFixture<PrimaryAndSecondaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrimaryAndSecondaryComponent]
    });
    fixture = TestBed.createComponent(PrimaryAndSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

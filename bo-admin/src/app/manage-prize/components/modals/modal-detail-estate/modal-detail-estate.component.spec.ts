import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDetailEstateComponent } from './modal-detail-estate.component';

describe('ModalDetailEstateComponent', () => {
  let component: ModalDetailEstateComponent;
  let fixture: ComponentFixture<ModalDetailEstateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalDetailEstateComponent]
    });
    fixture = TestBed.createComponent(ModalDetailEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

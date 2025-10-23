import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnersListComponent } from './partners-list.component';

describe('PartnersListComponent', () => {
  let component: PartnersListComponent;
  let fixture: ComponentFixture<PartnersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PartnersListComponent]
    });
    fixture = TestBed.createComponent(PartnersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

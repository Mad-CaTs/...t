import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnerTicketsComponent } from './partner-tickets.component';


describe('PartnerTicketsComponent', () => {
  let component: PartnerTicketsComponent;
  let fixture: ComponentFixture<PartnerTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerTicketsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartnerTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

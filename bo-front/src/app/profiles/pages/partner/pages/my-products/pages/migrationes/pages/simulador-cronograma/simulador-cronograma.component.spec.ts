import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimuladorCronogramaComponent } from './simulador-cronograma.component';

describe('SimuladorCronogramaComponent', () => {
  let component: SimuladorCronogramaComponent;
  let fixture: ComponentFixture<SimuladorCronogramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimuladorCronogramaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimuladorCronogramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

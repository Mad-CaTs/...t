import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCorreoComponent } from './card-correo.component';

describe('CardCorreoComponent', () => {
  let component: CardCorreoComponent;
  let fixture: ComponentFixture<CardCorreoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCorreoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

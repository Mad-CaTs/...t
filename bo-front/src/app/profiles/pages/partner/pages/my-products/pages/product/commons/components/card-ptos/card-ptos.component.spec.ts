import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPtosComponent } from './card-ptos.component';

describe('CardPtosComponent', () => {
  let component: CardPtosComponent;
  let fixture: ComponentFixture<CardPtosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPtosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardPtosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

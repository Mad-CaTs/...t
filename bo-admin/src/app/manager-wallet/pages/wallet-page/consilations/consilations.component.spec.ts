import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsilationsComponent } from './consilations.component';

describe('ConsilationsComponent', () => {
  let component: ConsilationsComponent;
  let fixture: ComponentFixture<ConsilationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsilationsComponent]
    });
    fixture = TestBed.createComponent(ConsilationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

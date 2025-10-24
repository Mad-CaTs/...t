import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeolaAdviceComponent } from './keola-advice.component';

describe('KeolaAdviceComponent', () => {
  let component: KeolaAdviceComponent;
  let fixture: ComponentFixture<KeolaAdviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeolaAdviceComponent]
    });
    fixture = TestBed.createComponent(KeolaAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

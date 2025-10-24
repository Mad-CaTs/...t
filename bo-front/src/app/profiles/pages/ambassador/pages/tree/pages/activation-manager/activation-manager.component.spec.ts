import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationManagerComponent } from './activation-manager.component';

describe('ActivationManagerComponent', () => {
  let component: ActivationManagerComponent;
  let fixture: ComponentFixture<ActivationManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivationManagerComponent]
    });
    fixture = TestBed.createComponent(ActivationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

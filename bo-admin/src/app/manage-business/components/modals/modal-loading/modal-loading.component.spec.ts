import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLoadingComponentManageBusiness } from './modal-loading.component';

describe('ModalLoadingComponent', () => {
  let component: ModalLoadingComponentManageBusiness;
  let fixture: ComponentFixture<ModalLoadingComponentManageBusiness>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ModalLoadingComponentManageBusiness]
    });
    fixture = TestBed.createComponent(ModalLoadingComponentManageBusiness);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

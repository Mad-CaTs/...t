import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsImportSuccessComponent } from './modals-import-success.component';

describe('ModalsImportSuccessComponent', () => {
  let component: ModalsImportSuccessComponent;
  let fixture: ComponentFixture<ModalsImportSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalsImportSuccessComponent]
    });
    fixture = TestBed.createComponent(ModalsImportSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

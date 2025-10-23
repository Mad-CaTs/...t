import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsDownloadSuccessComponent } from './modals-download-success.component';

describe('ModalsDownloadSuccessComponent', () => {
  let component: ModalsDownloadSuccessComponent;
  let fixture: ComponentFixture<ModalsDownloadSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalsDownloadSuccessComponent]
    });
    fixture = TestBed.createComponent(ModalsDownloadSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

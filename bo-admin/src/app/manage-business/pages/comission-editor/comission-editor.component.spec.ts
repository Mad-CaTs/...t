import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComissionEditorComponent } from './comission-editor.component';

describe('ComissionEditorComponent', () => {
  let component: ComissionEditorComponent;
  let fixture: ComponentFixture<ComissionEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComissionEditorComponent]
    });
    fixture = TestBed.createComponent(ComissionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronogramTemplateComponent } from './cronogram-template.component';

describe('CronogramTemplateComponent', () => {
  let component: CronogramTemplateComponent;
  let fixture: ComponentFixture<CronogramTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CronogramTemplateComponent]
    });
    fixture = TestBed.createComponent(CronogramTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

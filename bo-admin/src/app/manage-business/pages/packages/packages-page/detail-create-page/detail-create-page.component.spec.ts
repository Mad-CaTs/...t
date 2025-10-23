import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCreatePageComponent } from './detail-create-page.component';

describe('DetailCreatePageComponent', () => {
  let component: DetailCreatePageComponent;
  let fixture: ComponentFixture<DetailCreatePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCreatePageComponent]
    });
    fixture = TestBed.createComponent(DetailCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUserByIdComponent } from './list-user-by-id.component';

describe('ListUserByIdComponent', () => {
  let component: ListUserByIdComponent;
  let fixture: ComponentFixture<ListUserByIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListUserByIdComponent]
    });
    fixture = TestBed.createComponent(ListUserByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDataUsersComponent } from './modify-data-users.component';

describe('ModifyDataUsersComponent', () => {
  let component: ModifyDataUsersComponent;
  let fixture: ComponentFixture<ModifyDataUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyDataUsersComponent]
    });
    fixture = TestBed.createComponent(ModifyDataUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

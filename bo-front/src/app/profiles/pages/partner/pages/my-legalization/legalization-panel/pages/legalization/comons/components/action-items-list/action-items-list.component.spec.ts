import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionItemsListComponent } from './action-items-list.component';

describe('ActionItemsListComponent', () => {
  let component: ActionItemsListComponent;
  let fixture: ComponentFixture<ActionItemsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionItemsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActionItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

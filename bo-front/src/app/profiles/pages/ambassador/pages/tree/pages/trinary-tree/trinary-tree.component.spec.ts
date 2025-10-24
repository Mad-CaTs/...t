import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrinaryTreeComponent } from './trinary-tree.component';

describe('TrinaryTreeComponent', () => {
  let component: TrinaryTreeComponent;
  let fixture: ComponentFixture<TrinaryTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrinaryTreeComponent]
    });
    fixture = TestBed.createComponent(TrinaryTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubProfileChangeItemComponent } from './sub-profile-change-item.component';

describe('SubProfileChangeItemComponent', () => {
  let component: SubProfileChangeItemComponent;
  let fixture: ComponentFixture<SubProfileChangeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubProfileChangeItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubProfileChangeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

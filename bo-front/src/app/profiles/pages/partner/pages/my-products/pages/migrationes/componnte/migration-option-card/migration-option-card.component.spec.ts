import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationOptionCardComponent } from './migration-option-card.component';

describe('MigrationOptionCardComponent', () => {
  let component: MigrationOptionCardComponent;
  let fixture: ComponentFixture<MigrationOptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MigrationOptionCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MigrationOptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

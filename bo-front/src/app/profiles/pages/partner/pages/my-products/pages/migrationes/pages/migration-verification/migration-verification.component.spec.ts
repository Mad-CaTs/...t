import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationVerificationComponent } from './migration-verification.component';

describe('MigrationVerificationComponent', () => {
  let component: MigrationVerificationComponent;
  let fixture: ComponentFixture<MigrationVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MigrationVerificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MigrationVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

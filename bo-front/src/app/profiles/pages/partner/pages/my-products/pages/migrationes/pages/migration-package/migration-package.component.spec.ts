import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationPackageComponent } from './migration-package.component';

describe('MigrationPackageComponent', () => {
  let component: MigrationPackageComponent;
  let fixture: ComponentFixture<MigrationPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MigrationPackageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MigrationPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

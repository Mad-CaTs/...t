import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationPortafoliosComponent } from './migration-portafolios.component';

describe('MigrationPortafoliosComponent', () => {
  let component: MigrationPortafoliosComponent;
  let fixture: ComponentFixture<MigrationPortafoliosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MigrationPortafoliosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MigrationPortafoliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

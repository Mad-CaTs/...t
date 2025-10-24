import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabProfilesComponent } from './tab-profiles.component';

describe('TabProfilesComponent', () => {
  let component: TabProfilesComponent;
  let fixture: ComponentFixture<TabProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabProfilesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

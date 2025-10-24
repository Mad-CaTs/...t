import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLegalizationComponent } from './my-legalization.component';

describe('MyLegalizationComponent', () => {
  let component: MyLegalizationComponent;
  let fixture: ComponentFixture<MyLegalizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLegalizationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyLegalizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

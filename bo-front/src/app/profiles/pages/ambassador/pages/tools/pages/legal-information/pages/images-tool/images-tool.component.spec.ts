import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesToolComponent } from './images-tool.component';

describe('ImagesToolComponent', () => {
  let component: ImagesToolComponent;
  let fixture: ComponentFixture<ImagesToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesToolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

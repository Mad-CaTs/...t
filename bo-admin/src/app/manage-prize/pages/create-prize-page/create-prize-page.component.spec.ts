import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePrizePageContainerComponent } from './create-prize-page.component';

describe('CreatePrizePageContainerComponent', () => {
  let component: CreatePrizePageContainerComponent;
  let fixture: ComponentFixture<CreatePrizePageContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreatePrizePageContainerComponent]
    });
    fixture = TestBed.createComponent(CreatePrizePageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

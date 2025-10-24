// news-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsCardComponent } from './news-card.component';

describe('NewsCardComponent', () => {
  let component: NewsCardComponent;
  let fixture: ComponentFixture<NewsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewsCardComponent]
    });
    fixture = TestBed.createComponent(NewsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cardClick event when onCardClick is called', () => {
    spyOn(component.cardClick, 'emit');
    
    component.title = 'Test Title';
    component.description = 'Test Description';
    component.imageUrl = 'test-image.jpg';
    component.onCardClick();
    
    expect(component.cardClick.emit).toHaveBeenCalledWith({
      id: '',
      title: 'Test Title',
      description: 'Test Description',
      imageUrl: 'test-image.jpg',
      date: undefined,
      category: undefined,
      buttonText: undefined,
      imageWidth: undefined,
      imageHeight: undefined
    });
  });

  it('should have correct default values', () => {
    expect(component.buttonText).toBe('Más información');
    expect(component.isLarge).toBe(false);
    expect(component.showSizeInfo).toBe(false);
  });
});
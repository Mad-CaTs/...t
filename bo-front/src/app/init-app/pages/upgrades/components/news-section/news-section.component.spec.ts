// news-section.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsSectionComponent } from './news-section.component';
import { NewsCardComponent } from '../news-card/news-card.component';

describe('NewsSectionComponent', () => {
  let component: NewsSectionComponent;
  let fixture: ComponentFixture<NewsSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NewsSectionComponent, NewsCardComponent]
    });
    fixture = TestBed.createComponent(NewsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setup news layout correctly', () => {
    const mockNewsData = [
      { id: 1, title: 'News 1', imageUrl: 'news-1.png' },
      { id: 2, title: 'News 2', imageUrl: 'news-2.png' },
      { id: 3, title: 'News 3', imageUrl: 'news-3.png' }
    ];
    
    component.newsData = mockNewsData;
    component.ngOnInit();
    
    expect(component.featuredNews).toEqual(mockNewsData[0]);
    expect(component.secondaryNews).toEqual([mockNewsData[1], mockNewsData[2]]);
  });

  it('should emit newsClick when onNewsClick is called', () => {
    spyOn(component.newsClick, 'emit');
    
    const mockNewsData = { id: 1, title: 'Test', imageUrl: 'test.jpg' };
    component.onNewsClick(mockNewsData);
    
    expect(component.newsClick.emit).toHaveBeenCalledWith(mockNewsData);
  });

  it('should emit viewAllClick when onViewAllClick is called', () => {
    spyOn(component.viewAllClick, 'emit');
    
    component.onViewAllClick();
    
    expect(component.viewAllClick.emit).toHaveBeenCalled();
  });
});
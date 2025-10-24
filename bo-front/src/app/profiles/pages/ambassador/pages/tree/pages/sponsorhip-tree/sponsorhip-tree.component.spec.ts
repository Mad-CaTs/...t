import { ComponentFixture, TestBed } from '@angular/core/testing';
import SponsorhipTreeComponent from './sponsorhip-tree.component';


describe('SponsorhipTreeComponent', () => {
  let component: SponsorhipTreeComponent;
  let fixture: ComponentFixture<SponsorhipTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SponsorhipTreeComponent]
    });
    fixture = TestBed.createComponent(SponsorhipTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

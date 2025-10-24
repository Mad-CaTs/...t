import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteMenuComponent } from './autocomplete-menu.component';

describe('AutocompleteMenuComponent', () => {
  let component: AutocompleteMenuComponent;
  let fixture: ComponentFixture<AutocompleteMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteMenuComponent]
    });
    fixture = TestBed.createComponent(AutocompleteMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

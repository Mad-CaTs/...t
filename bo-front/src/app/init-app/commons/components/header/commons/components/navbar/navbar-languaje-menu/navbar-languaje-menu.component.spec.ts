import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLanguajeMenuComponent } from './navbar-languaje-menu.component';

describe('NavbarLanguajeMenuComponent', () => {
  let component: NavbarLanguajeMenuComponent;
  let fixture: ComponentFixture<NavbarLanguajeMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NavbarLanguajeMenuComponent]
    });
    fixture = TestBed.createComponent(NavbarLanguajeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

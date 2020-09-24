import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPagaComponent } from './landing-paga.component';

describe('LandingPagaComponent', () => {
  let component: LandingPagaComponent;
  let fixture: ComponentFixture<LandingPagaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPagaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPagaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

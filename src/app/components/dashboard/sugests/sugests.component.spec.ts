import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugestsComponent } from './sugests.component';

describe('SugestsComponent', () => {
  let component: SugestsComponent;
  let fixture: ComponentFixture<SugestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SugestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SugestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

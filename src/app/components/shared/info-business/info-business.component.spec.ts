import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBusinessComponent } from './info-business.component';

describe('InfoBusinessComponent', () => {
  let component: InfoBusinessComponent;
  let fixture: ComponentFixture<InfoBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoBusinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPaymentsComponent } from './info-payments.component';

describe('InfoPaymentsComponent', () => {
  let component: InfoPaymentsComponent;
  let fixture: ComponentFixture<InfoPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

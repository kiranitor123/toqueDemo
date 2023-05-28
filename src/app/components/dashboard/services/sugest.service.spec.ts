import { TestBed } from '@angular/core/testing';

import { SugestService } from './sugest.service';

describe('SugestService', () => {
  let service: SugestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SugestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CityandheroService } from './cityandhero.service';

describe('CityandheroService', () => {
  let service: CityandheroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityandheroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

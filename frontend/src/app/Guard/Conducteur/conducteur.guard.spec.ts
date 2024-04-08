import { TestBed } from '@angular/core/testing';

import { ConducteurGuard } from './conducteur.guard';

describe('ConducteurGuard', () => {
  let guard: ConducteurGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConducteurGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

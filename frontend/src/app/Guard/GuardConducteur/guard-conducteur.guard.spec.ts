import { TestBed } from '@angular/core/testing';

import { GuardConducteurGuard } from './guard-conducteur.guard';

describe('GuardConducteurGuard', () => {
  let guard: GuardConducteurGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardConducteurGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

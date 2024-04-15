import { TestBed } from '@angular/core/testing';

import { GuardChefDepartementGuard } from './guard-chef-departement.guard';

describe('GuardChefDepartementGuard', () => {
  let guard: GuardChefDepartementGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardChefDepartementGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ChefDepartementGuard } from './chef-departement.guard';

describe('ChefDepartementGuard', () => {
  let guard: ChefDepartementGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChefDepartementGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

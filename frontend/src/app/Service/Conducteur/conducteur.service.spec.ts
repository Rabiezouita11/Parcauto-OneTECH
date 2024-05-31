import { TestBed } from '@angular/core/testing';

import { ConducteurService } from './conducteur.service';

describe('ConducteurService', () => {
  let service: ConducteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConducteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

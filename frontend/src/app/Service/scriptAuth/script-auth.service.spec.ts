import { TestBed } from '@angular/core/testing';

import { ScriptAuthService } from './script-auth.service';

describe('ScriptAuthService', () => {
  let service: ScriptAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

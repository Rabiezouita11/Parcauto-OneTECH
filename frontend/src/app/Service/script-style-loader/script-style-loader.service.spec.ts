import { TestBed } from '@angular/core/testing';

import { ScriptStyleLoaderService } from './script-style-loader.service';

describe('ScriptStyleLoaderService', () => {
  let service: ScriptStyleLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptStyleLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

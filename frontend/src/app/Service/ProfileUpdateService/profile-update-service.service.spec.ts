import { TestBed } from '@angular/core/testing';

import { ProfileUpdateServiceService } from './profile-update-service.service';

describe('ProfileUpdateServiceService', () => {
  let service: ProfileUpdateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileUpdateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

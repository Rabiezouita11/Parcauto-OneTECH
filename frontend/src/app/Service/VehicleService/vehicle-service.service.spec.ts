import { TestBed } from '@angular/core/testing';

import { VehicleServiceService } from './vehicle-service.service';

describe('VehicleServiceService', () => {
  let service: VehicleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

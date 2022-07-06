import { TestBed } from '@angular/core/testing';

import { BinService } from './bin.service';

describe('BinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BinService = TestBed.get(BinService);
    expect(service).toBeTruthy();
  });
});

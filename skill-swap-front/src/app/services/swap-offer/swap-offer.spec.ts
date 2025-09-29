import { TestBed } from '@angular/core/testing';

import { SwapOffer } from './swap-offer';

describe('SwapOffer', () => {
  let service: SwapOffer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwapOffer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

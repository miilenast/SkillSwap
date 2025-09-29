import { TestBed } from '@angular/core/testing';

import { SkillOffer } from './skill-offer';

describe('SkillOffer', () => {
  let service: SkillOffer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillOffer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

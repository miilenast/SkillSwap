import { TestBed } from '@angular/core/testing';

import { SkillRequest } from './skill-request';

describe('SkillRequest', () => {
  let service: SkillRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

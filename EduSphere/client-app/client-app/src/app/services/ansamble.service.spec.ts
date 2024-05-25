import { TestBed } from '@angular/core/testing';

import { AnsambleService } from './ansamble.service';

describe('AnsambleService', () => {
  let service: AnsambleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnsambleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

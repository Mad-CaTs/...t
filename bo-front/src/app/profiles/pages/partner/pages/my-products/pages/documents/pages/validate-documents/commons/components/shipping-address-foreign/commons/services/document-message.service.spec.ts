import { TestBed } from '@angular/core/testing';

import { DocumentMessageService } from './document-message.service';

describe('DocumentMessageService', () => {
  let service: DocumentMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

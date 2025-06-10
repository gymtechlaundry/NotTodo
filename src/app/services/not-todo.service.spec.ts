import { TestBed } from '@angular/core/testing';

import { NotTodoService } from './not-todo.service';

describe('NotTodoServiceService', () => {
  let service: NotTodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotTodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

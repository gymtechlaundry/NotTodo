import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { DEFAULT_CATEGORIES } from '../core/config/categories';
import { CategoryService } from './category.service';
import { NotTodoService } from './not-todo.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let store: Record<string, string>;

  async function setup(items: Array<{ category?: string }> = []) {
    TestBed.resetTestingModule();
    store = {};
    spyOn(Preferences, 'get').and.callFake(async ({ key }) => ({
      value: store[key] ?? null,
    }));
    spyOn(Preferences, 'set').and.callFake(async ({ key, value }) => {
      store[key] = value;
    });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: NotTodoService,
          useValue: { getItems: async () => items },
        },
      ],
    });
    service = TestBed.inject(CategoryService);
    await service.init();
  }

  it('returns the five default categories', async () => {
    await setup();
    expect(service.list()).toEqual([...DEFAULT_CATEGORIES]);
  });

  it('adds and removes extra categories without dropping defaults', async () => {
    await setup();
    expect(await service.add(' Sleep ')).toBe('ok');
    expect(service.list()).toContain('Sleep');
    expect(service.extras()).toEqual(['Sleep']);

    expect(await service.remove('Sleep')).toBeTrue();
    expect(service.list()).toEqual([...DEFAULT_CATEGORIES]);
  });

  it('rejects empty, duplicate, and default deletes', async () => {
    await setup();
    expect(await service.add('   ')).toBe('empty');
    expect(await service.add('Productivity')).toBe('duplicate');
    expect(await service.add('health')).toBe('duplicate');
    expect(await service.remove('Health')).toBeFalse();
  });
});

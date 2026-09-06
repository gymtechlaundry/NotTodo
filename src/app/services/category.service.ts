import { Injectable, inject, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import {
  CATEGORY_MAX_LENGTH,
  DEFAULT_CATEGORIES,
  isDefaultCategory,
  normalizeCategory,
} from '../core/config/categories';
import { NotTodoService } from './not-todo.service';

export type CategoryAddResult = 'ok' | 'empty' | 'duplicate';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly extrasKey = 'customCategories';
  private readonly seededKey = 'customCategoriesSeeded';
  private readonly notTodo = inject(NotTodoService);
  readonly extras = signal<string[]>([]);
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }
    if (this.initPromise) {
      await this.initPromise;
      return;
    }

    this.initPromise = this.initInternal();
    try {
      await this.initPromise;
      this.initialized = true;
    } finally {
      this.initPromise = null;
    }
  }

  list(): string[] {
    return this.unique([...DEFAULT_CATEGORIES, ...this.extras()]);
  }

  isDefault(name: string): boolean {
    return isDefaultCategory(name);
  }

  async add(name: string): Promise<CategoryAddResult> {
    await this.init();
    const normalized = normalizeCategory(name).slice(0, CATEGORY_MAX_LENGTH);
    if (!normalized) {
      return 'empty';
    }

    const exists = this.list().some(
      (category) => category.toLowerCase() === normalized.toLowerCase()
    );
    if (exists) {
      return 'duplicate';
    }

    this.extras.update((current) => [...current, normalized]);
    await this.persist();
    return 'ok';
  }

  async remove(name: string): Promise<boolean> {
    await this.init();
    if (isDefaultCategory(name)) {
      return false;
    }

    const before = this.extras().length;
    this.extras.update((current) =>
      current.filter((category) => category.toLowerCase() !== normalizeCategory(name).toLowerCase())
    );
    if (this.extras().length === before) {
      return false;
    }

    await this.persist();
    return true;
  }

  private async initInternal(): Promise<void> {
    const stored = await Preferences.get({ key: this.extrasKey });
    this.extras.set(this.parseStored(stored.value));
    await this.seedFromExistingItems();
  }

  private async seedFromExistingItems(): Promise<void> {
    const seeded = await Preferences.get({ key: this.seededKey });
    if (seeded.value === 'true') {
      return;
    }

    const items = await this.notTodo.getItems();
    const imported = this.unique(
      items
        .map((item) => normalizeCategory(item.category || ''))
        .filter((category) => category && !isDefaultCategory(category))
    );

    if (imported.length) {
      this.extras.update((current) => this.unique([...current, ...imported]));
      await this.persist();
    }

    await Preferences.set({ key: this.seededKey, value: 'true' });
  }

  private async persist(): Promise<void> {
    await Preferences.set({
      key: this.extrasKey,
      value: JSON.stringify(this.extras()),
    });
  }

  private parseStored(raw: string | null): string[] {
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return this.unique(
        parsed
          .filter((value): value is string => typeof value === 'string')
          .map((value) => normalizeCategory(value).slice(0, CATEGORY_MAX_LENGTH))
          .filter((value) => value && !isDefaultCategory(value))
      );
    } catch {
      return [];
    }
  }

  private unique(names: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const name of names) {
      const key = name.toLowerCase();
      if (!name || seen.has(key)) {
        continue;
      }
      seen.add(key);
      result.push(name);
    }
    return result;
  }
}

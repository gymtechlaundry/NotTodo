import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { NotToDoItem } from '../models/not-todo-item';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'not_todo_db';
  private readonly webKey = 'not_todo_items';
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

  private async initInternal(): Promise<void> {
    if (this.isWeb()) {
      return;
    }

    try {
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      const consistency = await sqlite.checkConnectionsConsistency();
      const isConn = (await sqlite.isConnection(this.dbName, false)).result;
      const db = consistency.result && isConn
        ? await sqlite.retrieveConnection(this.dbName, false)
        : await sqlite.createConnection(
            this.dbName,
            false,
            'no-encryption',
            1,
            false
          );

      this.db = db;
      await this.db.open();
      await this.createTable();
    } catch (err) {
      console.error('[SQLite init error]', err);
      throw err;
    }
  }

  private isWeb(): boolean {
    return Capacitor.getPlatform() === 'web';
  }

  private async createTable(): Promise<void> {
    if (!this.db) return;

    const query = `
      CREATE TABLE IF NOT EXISTS not_todo_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        failCount INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        lastFailed TEXT
      );
    `;

    await this.db.execute(query);
  }

  async addItem(item: NotToDoItem): Promise<void> {
    await this.init();

    if (this.isWeb()) {
      const items = this.readWeb();
      const nextId = items.reduce((max, current) => Math.max(max, current.id), 0) + 1;
      items.push({ ...item, id: nextId, failCount: item.failCount || 0 });
      this.writeWeb(items);
      return;
    }

    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `INSERT INTO not_todo_items (title, category, failCount, createdAt) VALUES (?, ?, ?, ?);`,
      [item.title, item.category, item.failCount, item.createdAt]
    );
  }

  async deleteItem(id: number): Promise<void> {
    await this.init();

    if (this.isWeb()) {
      this.writeWeb(this.readWeb().filter(item => item.id !== id));
      return;
    }

    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `DELETE FROM not_todo_items WHERE id = ?;`,
      [id]
    );
  }

  async getItems(): Promise<NotToDoItem[]> {
    await this.init();

    const items = this.isWeb()
      ? this.readWeb()
      : await this.queryNativeItems();

    return items.map(item => ({
      ...item,
      failCount: Number(item.failCount) || 0,
    }));
  }

  async incrementFail(id: number): Promise<void> {
    await this.init();
    const now = new Date().toISOString();

    if (this.isWeb()) {
      const items = this.readWeb().map(item =>
        item.id === id
          ? { ...item, failCount: (Number(item.failCount) || 0) + 1, lastFailed: now }
          : item
      );
      this.writeWeb(items);
      return;
    }

    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `UPDATE not_todo_items SET failCount = failCount + 1, lastFailed = ? WHERE id = ?;`,
      [now, id]
    );
  }

  async getLastFailDate(): Promise<Date | null> {
    await this.init();

    try {
      if (this.isWeb()) {
        const dates = this.readWeb()
          .map(item => item.lastFailed)
          .filter((value): value is string => !!value)
          .map(value => new Date(value).getTime());
        return dates.length ? new Date(Math.max(...dates)) : null;
      }

      if (!this.db) return null;

      const result = await this.db.query(
        `SELECT MAX(lastFailed) AS lastFail FROM not_todo_items`
      );

      const lastFailStr = result.values?.[0]?.lastFail;
      return lastFailStr ? new Date(lastFailStr) : null;
    } catch (err) {
      console.error('Failed to get last failed date', err);
      return null;
    }
  }

  private async queryNativeItems(): Promise<NotToDoItem[]> {
    if (!this.db) throw new Error('Database not initialized');
    const result = await this.db.query('SELECT * FROM not_todo_items');
    return (result.values || []) as NotToDoItem[];
  }

  private readWeb(): NotToDoItem[] {
    try {
      const raw = localStorage.getItem(this.webKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeWeb(items: NotToDoItem[]): void {
    localStorage.setItem(this.webKey, JSON.stringify(items));
  }
}

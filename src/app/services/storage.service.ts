import { Injectable } from '@angular/core';
import { NotToDoItem } from '../models/not-todo-item';
import { SQLiteConnection, CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = "not_todo_db";

  constructor() { }

  async init(): Promise<void> {
    try {
      // Create or retrieve the connection
      const sqlite = new SQLiteConnection(CapacitorSQLite);
      const db: SQLiteDBConnection = await sqlite.createConnection(
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
      console.error('[SQLite init error', err);
      throw err;
    }
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
    if (!this.db) throw new Error('Database not initialized');

    const values = [item.title, item.category, item.failCount, item.createdAt];

    await this.db.run(
      `INSERT INTO not_todo_items (title, category, failCount, createdAt) VALUES (?, ?, ?, ?);`,
      values
    );
  }

  async deleteItem(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      `DELETE FROM not_todo_items WHERE id = ?;`,
      [id]
    );
  }
  
  async getItems(): Promise<NotToDoItem[]> {
    if (!this.db) throw new Error('Database not initialized');
  
    const result = await this.db.query('SELECT * FROM not_todo_items');
    
    const items: NotToDoItem[] = (result.values || []) as NotToDoItem[];
    return items;
    
  }

  async incrementFail(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    const now = new Date().toISOString();

    await this.db.run(
      `UPDATE not_todo_items SET failCount = failCount + 1, lastFailed = ? WHERE id = ?;`,
      [now, id]
    );
  }

  async getLastFailDate(): Promise<Date | null> {
    if (!this.db) return null;

    try {
      const result = await this.db.query(
        `SELECT MAX(lastFailed) AS lastFail FROM not_todo_items`
      );

      const lastFailStr = result.values?.[0]?.lastFail;
      return lastFailStr ? new Date(lastFailStr) : null;
    } catch (err) {
      console.error('Failed to get last failed date', err)
      return null;
    }
  }

}

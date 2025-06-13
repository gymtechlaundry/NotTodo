import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { NotToDoItem } from '../models/not-todo-item';

@Injectable({
  providedIn: 'root'
})
export class NotTodoService {
  title: string = '';
  category: string = '';

  constructor(private storage: StorageService) { }

  async initDB() {
    await this.storage.init();
  }

  async addItem(title: string, category: string = ''): Promise<void> {
    const item: NotToDoItem = {
      id: 0,
      title,
      category,
      failCount: 0,
      createdAt: new Date().toISOString(),
    };

    await this.storage.addItem(item);
  }

  async deleteItemById(id: number) {
    await this.storage.deleteItem(id);
  }

  getItems(): Promise<NotToDoItem[]> {
    return this.storage.getItems();
  }

  logFail(id: number) {
    return this.storage.incrementFail(id);
  }

   async getLastFailDate(): Promise<Date | null> {
    return this.storage.getLastFailDate();
  }


}

import { signal } from "@angular/core";
import { NotToDoItem } from "../models/not-todo-item";

export const todoItems = signal<NotToDoItem[]>([]);
import { Component, OnInit } from '@angular/core';
import { IonFooter, IonHeader, IonContent, IonText, IonButton, IonIcon, IonLabel, IonItem, IonList, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { NotTodoService } from '../services/not-todo.service';
import { CommonModule, } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { todoItems } from '../utility/global-signals';
import { ToolbarComponent } from "../components/toolbar/toolbar.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonFooter, IonItemOption, IonItemOptions, IonItemSliding, FormsModule, IonList, IonItem, IonLabel, IonIcon, IonButton, IonText, IonHeader, IonContent, CommonModule, ToolbarComponent],
})
export class HomePage implements OnInit {
  todoItems = todoItems;
  newItem: string = ''

  constructor(private notTodoService: NotTodoService, private router: Router) {
    addIcons({
      addOutline
    })
  }

  async ngOnInit() {
    await this.notTodoService.initDB();
    await this.loadItems();
  }

  async ionViewWillEnter() {
    await this.loadItems();
  }

  async loadItems() {
    this.todoItems.set(await this.notTodoService.getItems());
  }

  async logFail(id:number) {
    await this.notTodoService.logFail(id);
    await this.loadItems();
  }

  goToAddItem() {
    this.router.navigateByUrl('add-item')
  }

  async deleteItemById(id: number, slidingItem: IonItemSliding) {
    await this.notTodoService.deleteItemById(id)
    this.todoItems.update(currentItems => currentItems.filter(item => item.id !== id));
    slidingItem.close();
  }


}

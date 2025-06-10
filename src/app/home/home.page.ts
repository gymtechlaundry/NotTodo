import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonButton, IonIcon, IonLabel, IonItem, IonList } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular'
import { AddItemModalComponent } from '../components/add-item-modal/add-item-modal.component';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { NotToDoItem } from '../models/not-todo-item';
import { NotTodoService } from '../services/not-todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonList, IonItem, IonLabel, IonIcon, IonButton, IonText, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule],
  providers: [ ModalController ]
})
export class HomePage implements OnInit {
  items: NotToDoItem[] = [];
  newItem: string = ''

  constructor(private modalCtrl: ModalController, private notTodoService: NotTodoService) {
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
    this.items = await this.notTodoService.getItems();
  }

  async addItem() {
    if (!this.newItem) return;
    await this.notTodoService.addItem(this.newItem);
    this.newItem = '';
    await this.loadItems();
  }

  async logFail(id:number) {
    await this.notTodoService.logFail(id);
    await this.loadItems();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddItemModalComponent,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log('Modal returned:', data);
  }


}

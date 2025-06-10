import { Component } from '@angular/core';
import { IonTitle, IonContent, IonHeader, IonToolbar, IonButton, IonCol, IonRow, IonLabel, IonInput, IonItem } from "@ionic/angular/standalone";
import { ModalController } from '@ionic/angular'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.scss'],
  imports: [IonItem, 
    IonInput, 
    IonLabel, 
    IonRow, 
    IonCol, 
    IonButton, 
    IonToolbar, 
    IonTitle,
    IonContent,
    IonHeader,
    FormsModule
  ]
})
export class AddItemModalComponent {
  title: string = '';
  category: string = '';

  constructor(private modalCtrl: ModalController) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss({ title: this.title, category: this.category });
  }

}

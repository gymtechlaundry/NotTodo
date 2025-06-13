import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonItem, IonRow, IonCol, IonButton, IonInput, IonText } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { NotTodoService } from 'src/app/services/not-todo.service';
import { Router } from '@angular/router';
import { todoItems } from 'src/app/utility/global-signals';
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
  standalone: true,
  imports: [IonText, IonInput, IonButton, IonCol, IonRow, IonItem, IonContent, IonHeader, CommonModule, FormsModule, ToolbarComponent]
})
export class AddItemPage implements OnInit {
  title: string = '';
  category: string = '';
  todoItems = todoItems;
  constructor(private navCtrl: NavController, private notTodoService: NotTodoService, private router: Router) { }

  ngOnInit() {
  }

  cancel() {
    this.navCtrl.back();
  }

  async save() {
    if (!this.title) return;
    await this.notTodoService.addItem(this.title, this.category);
    todoItems.set(await this.notTodoService.getItems());
    this.navCtrl.back();
  }
}

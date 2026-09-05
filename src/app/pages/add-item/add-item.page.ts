import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonItem, IonRow, IonCol, IonButton, IonInput, IonText } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { NotTodoService } from 'src/app/services/not-todo.service';
import { ReminderService } from 'src/app/services/reminder.service';
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
  constructor(
    private navCtrl: NavController,
    private notTodoService: NotTodoService,
    private reminderService: ReminderService,
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.navCtrl.back();
  }

  async save() {
    const title = this.title.trim();
    if (!title) return;
    await this.notTodoService.addItem(title, this.category.trim());
    todoItems.set(await this.notTodoService.getItems());
    await this.reminderService.syncSchedule();
    this.navCtrl.back();
  }
}

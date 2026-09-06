import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonContent,
  IonHeader,
  IonItem,
  IonRow,
  IonCol,
  IonButton,
  IonInput,
  IonText,
  IonSelect,
  IonSelectOption,
  ToastController,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { CATEGORY_MAX_LENGTH, normalizeCategory } from 'src/app/core/config/categories';
import { CategoryService } from 'src/app/services/category.service';
import { NotTodoService } from 'src/app/services/not-todo.service';
import { ReminderService } from 'src/app/services/reminder.service';
import { todoItems } from 'src/app/utility/global-signals';
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonInput,
    IonButton,
    IonCol,
    IonRow,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonContent,
    IonHeader,
    CommonModule,
    FormsModule,
    ToolbarComponent,
  ]
})
export class AddItemPage {
  private readonly navCtrl = inject(NavController);
  private readonly notTodoService = inject(NotTodoService);
  private readonly reminderService = inject(ReminderService);
  private readonly categoryService = inject(CategoryService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  title = '';
  category = '';
  todoItems = todoItems;
  categories = signal<string[]>([]);

  async ionViewWillEnter() {
    await this.loadCategories();
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

  async addCategory() {
    const alert = await this.alertController.create({
      header: 'Add category',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'e.g. Sleep',
          attributes: { maxlength: CATEGORY_MAX_LENGTH },
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Add', role: 'confirm' },
      ],
    });
    await alert.present();
    const { data, role } = await alert.onDidDismiss();
    if (role !== 'confirm') {
      return;
    }

    const name = data?.values?.name ?? '';
    const result = await this.categoryService.add(name);
    if (result === 'empty') {
      await this.showToast('Enter a category name.');
      return;
    }
    if (result === 'duplicate') {
      await this.showToast('That category is already on the list.');
      return;
    }

    await this.loadCategories();
    this.category = normalizeCategory(name);
  }

  private async loadCategories() {
    await this.categoryService.init();
    this.categories.set(this.categoryService.list());
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
    });
    await toast.present();
  }
}

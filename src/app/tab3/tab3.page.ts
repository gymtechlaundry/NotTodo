import { Component } from '@angular/core';
import { IonHeader, IonContent, IonText } from '@ionic/angular/standalone';
import { ToolbarComponent } from "../components/toolbar/toolbar.component";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonText, IonHeader, IonContent, ToolbarComponent],
})
export class Tab3Page {
  constructor() {}
}

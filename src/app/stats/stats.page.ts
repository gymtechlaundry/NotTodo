import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import Chart from 'chart.js/auto';
import { ToolbarComponent } from "../components/toolbar/toolbar.component";
import { NotToDoItem } from '../models/not-todo-item';
import { NotTodoService } from '../services/not-todo.service';
import { chartColors } from '../utility/chart-colors';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, IonicModule, NgChartsModule, ToolbarComponent],
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss']
})
export class StatsPage {
  items: NotToDoItem[] = [];

  constructor(private notTodoService: NotTodoService) {}

  async ngOnInit() {
    await this.getItems();
    console.log(this.items.map(row => row.failCount));
    
    await this.createChart();
  }

  async getItems() {
    this.items = await this.notTodoService.getItems();
  }

  async createChart() {
    const chartElement = document.getElementById('chart') as HTMLCanvasElement | null;
    if (!chartElement) {
      console.error("Chart element not found");
      return;
    }
    const total = this.items.reduce((a, b) => a + b.failCount, 0);

    new Chart(
      chartElement,
      {
        type: 'pie',
        data: {
          labels: this.items.map(row => row.category),
          datasets: [
            {
              data: this.items.map(row => row.failCount),
              backgroundColor: chartColors
            }
          ]
        },
        options: {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                generateLabels: (chart) => {
                  const dataset = chart.data.datasets[0];
                  const bgColors = dataset.backgroundColor as string[];
                  return chart.data.labels!.map((label, i) => {
                    const value = dataset.data[i] as number;
                    const percentage = ((value / total) * 100).toFixed(0);

                    return {
                      text: `${label} (${percentage}%)`,
                      fillStyle: bgColors[i],
                      strokeStyle: '#fff',
                      lineWidth: 1,
                      hidden: !chart.getDataVisibility(i),
                      index: i
                    }
                  })
                }
              }
            }
          }
        }
      }
    )
  }
}
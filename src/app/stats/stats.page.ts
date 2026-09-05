import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgChartsModule } from 'ng2-charts';
import Chart, { ChartConfiguration } from 'chart.js/auto';

import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { NotToDoItem } from '../models/not-todo-item';
import { NotTodoService } from '../services/not-todo.service';
import { chartColors } from '../utility/chart-colors';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, IonicModule, NgChartsModule, ToolbarComponent],
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage {
  items: NotToDoItem[] = [];
  chart: Chart<'pie'> | null = null;
  totalFails = 0;

  constructor(private notTodoService: NotTodoService) {}

  async ionViewWillEnter() {
    await this.getItems();
    this.getTotalFails();
    setTimeout(() => this.renderChart(), 0);
  }

  async getItems() {
    this.items = await this.notTodoService.getItems();
  }

  getTotalFails() {
    this.totalFails = this.items.reduce((sum, item) => sum + (item.failCount || 0), 0);
  }

  renderChart() {
    if (this.totalFails <= 0) {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      return;
    }

    const chartElement = document.getElementById('chart') as HTMLCanvasElement | null;
    if (!chartElement) return;

    const failedItems = this.items.filter(item => (item.failCount || 0) > 0);
    const data = failedItems.map(item => item.failCount);
    const labels = failedItems.map(item => item.title || 'Untitled');

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: chartColors,
        }]
      },
      options: {
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: (chart) => {
                const dataset = chart.data.datasets[0];
                const values = (dataset.data as Array<number | string | null | undefined>)
                  .map(v => Number(v) || 0);
                const safeTotal = values.reduce((s, v) => s + v, 0);
                const bgColors = (dataset.backgroundColor as string[]) || [];

                return (chart.data.labels ?? []).map((rawLabel, i) => {
                  const label = (rawLabel as string) || 'Untitled';
                  const value = values[i] ?? 0;
                  const percent = safeTotal > 0
                    ? Math.round((value / safeTotal) * 100)
                    : 0;

                  return {
                    text: `${label} (${percent}%)`,
                    fillStyle: bgColors[i % bgColors.length] || '#999',
                    strokeStyle: '#fff',
                    lineWidth: 1,
                    usePointStyle: true,
                    hidden: !chart.getDataVisibility(i),
                    index: i,
                  };
                });
              }
            }
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(chartElement, config);
  }
}

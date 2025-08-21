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
  totalFails: number = 0;

  constructor(private notTodoService: NotTodoService) {}

  async ionViewWillEnter() {
    await this.getItems();
    this.getTotalFails();
    this.renderChart();
  }
  
  async getItems() {
    this.items = await this.notTodoService.getItems();
  }

  getTotalFails() {
    this.totalFails = this.items.reduce((sum, item) => sum + (item.failCount || 0), 0);
  }
  
  renderChart() {
    const chartElement = document.getElementById('chart') as HTMLCanvasElement;
    if (!chartElement) return;
    
    const data = this.items.map(item => item.failCount);
    const labels = this.items.map(item => item.title || 'UnTitled');
    const total = data.reduce((sum, val) => sum + val, 0);
    
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
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              generateLabels: (chart) => {
                const dataset = chart.data.datasets[0];
                const data = (dataset.data as Array<number | string | null | undefined>)
                  .map(v => Number(v) || 0);
                const safeTotal = data.reduce((s, v) => s + v, 0);

                const bgColors = (dataset.backgroundColor as string[]) || [];

                return (chart.data.labels ?? []).map((rawLabel, i) => {
                  const label = (rawLabel as string) || 'Untitled';
                  const value = data[i] ?? 0;

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

    // Destroy previous chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(chartElement, config);
  }
}
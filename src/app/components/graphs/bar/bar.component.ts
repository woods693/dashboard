import { Component, Inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MockData, mockData } from '../../../../assets/data/mock_data';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss'
})
export class BarComponent implements OnChanges{
  public barChartLegend = true;
  public barChartPlugins = [];

  @Input() startDate!: string;
  @Input() endDate!: string;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor() {
    Chart.register(...registerables)
  };

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['startDate'] || changes['endDate']) {
        this.updateChartData();
      }
  }
  public chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) => {
            return '$' + tickValue.toString();
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Sales Channel Breakdown',
        font: {
          size: 18,
        }
      },
      tooltip: {
        mode: 'nearest',
      }
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  };

  updateChartData(){
    this.chartData = {
      labels: ['In-Store', 'Online'],
      datasets: [
        {
          data: [this.getTotalSale(this.startDate, this.endDate, 'instore'), 0],
          label: 'In-Store'
        },
        {
          data: [0, this.getTotalSale(this.startDate, this.endDate, 'online')], 
          label: 'Online'
        }
      ]
    };
    if (this.chart) {
      this.chart.update();  // Ensure chart is updated with the new data
    }
  }

  public getTotalSale(startDate: string, endDate: string, channel: string) {
    let total = 0;
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');

    while (start <= end) {
      const date = start.toISOString().split('T')[0];
      const data = mockData[date as keyof MockData] || []
      total += data?.reduce((sum: number, avg: any) => {
        return avg.sales_channel == channel ? sum+avg.amount : sum;
      }, 0);
      start.setUTCDate(start.getUTCDate() + 1);
    }
    return total;
  }

}

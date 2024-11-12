import { Component, Inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { DateHelper } from '../../../services/date.helper';
import { DailyData, Sale } from '../../../services/data.interface';

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
  @Input() dataSet!: DailyData;
  
  titleDate: string = '';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor() {
    Chart.register(...registerables)
  };

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['startDate'] || changes['endDate'] || changes['dataSet']) {
        this.updateChartData();
        this.titleDate = DateHelper.setDateRangeString(this.startDate, this.endDate);
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
      this.chart.update();
    }
  }

  public getTotalSale(startDate: string, endDate: string, channel: string) {
    let total = 0;
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');

    while (start <= end) {
      const date = start.toISOString().split('T')[0];
      const data = this.dataSet[date as keyof DailyData] || []
      total += data?.reduce((sum: number, sale: Sale) => {
        return sale.salesChannel == channel ? sum+sale.amount : sum;
      }, 0);
      start.setUTCDate(start.getUTCDate() + 1);
    }
    return total;
  }

}

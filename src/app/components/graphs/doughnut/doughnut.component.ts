import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DateHelper } from '../../../services/date.helper';
import { DailyData, Sale, SaleKey } from '../../../services/data.interface';

interface SaleData {
  loyalty: number,
  customer: number,
  instore: number,
  online: number
}

@Component({
  selector: 'app-doughnut',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss'
})

export class DoughnutComponent implements OnInit, OnChanges{

  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() dataSet!: DailyData;
  titleDate: string = '';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public doughnutChartLabels: string[] = [
    'Loyalty Customer',
    'Normal Customer',
    'In-store Purchase',
    'Online Purchase',
  ];

  public saleMap: SaleData = {
    'loyalty': 0,
    'customer': 0,
    'instore': 0,
    'online': 0
  };

  ngOnInit(): void {
    this.getAllSaleNumbers(this.startDate, this.endDate);
    this.updateChartData()
    this.titleDate = DateHelper.setDateRangeString(this.startDate, this.endDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['startDate'] || changes['endDate'] || changes['dataSet']) {
      this.getAllSaleNumbers(this.startDate, this.endDate);
      this.updateChartData();
      this.titleDate = DateHelper.setDateRangeString(this.startDate, this.endDate);
    }
  }

  public doughnutChartColors = [
    {
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    },
  ];

  public chartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [],
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
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
      labels: this.doughnutChartLabels,
      datasets: [
        { data: [this.saleMap.loyalty, this.saleMap.customer, 0, 0], label: 'Customer Type Sales', backgroundColor: this.doughnutChartColors[0].backgroundColor },
        { data: [0, 0, this.saleMap.instore, this.saleMap.online], label: 'Sales Channel Sales', backgroundColor: this.doughnutChartColors[0].backgroundColor },
      ],
    };
    if (this.chart) {
      this.chart.update();
    }
  }

  public getAllSaleNumbers(startDate: string, endDate: string) {
    this.saleMap = {
      'loyalty': 0,
      'customer': 0,
      'instore': 0,
      'online': 0
    };
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    while (start <= end) {
      const date = start.toISOString().split('T')[0];
      const data = this.dataSet[date as keyof DailyData] || [];
      data?.forEach((sale: Sale) => {
        this.saleMap[sale.customerType] += sale.amount;
        this.saleMap[sale.salesChannel] += sale.amount;
      });
      start.setUTCDate(start.getUTCDate() + 1);
    }
  }

}

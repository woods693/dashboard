import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { DateHelper } from '../../../services/date.helper';
import { DailyData } from '../../../services/data.interface';

Chart.register(zoomPlugin);
@Component({
  standalone: true,
  imports: [BaseChartDirective],
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrl: './line.component.scss'
})
export class LineComponent implements OnInit, OnChanges{

  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() dataSet!: DailyData;
  titleDate: string = '';
  public dateList: string[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  dataList1: number[] = [];
  dataList2: number[] = [];
  allFinal: number = 0;
  loyaltyFinal: number = 0;

  constructor() {
    Chart.register(...registerables)
  };

  ngOnInit(): void {
    this.updateChartData();
    this.titleDate = DateHelper.setDateRangeString(this.startDate, this.endDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['startDate'] || changes['endDate'] || changes['dataSet']) {
      this.updateChartData();
      this.titleDate = DateHelper.setDateRangeString(this.startDate, this.endDate);
    }
  }
  public chartType: ChartType = 'line';

  public chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: []
  };

  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
          minRotation: 45,
          maxRotation: 45, 
          callback: function(value: any, index: number, ticks: any[]) {
            const labels = this.chart.data.labels as string[];
            const label = labels[index];
            // Show every 7th label (e.g., weekly labels)
            if (index % 7 === 0) {
              return label;
            }
            return;
          }
        }
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
      tooltip: {
        mode: 'nearest',
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true
          },
          pinch: {
            enabled: true
          },
          mode: 'x'
        },
      }
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  };

  updateChartData(){
    this.dateList = this.generateLabels(this.startDate, this.endDate);
    this.dataList1 = this.getSalePerDay(this.dateList);
    this.dataList2 = this.getSalePerDay(this.dateList, null, true);
    this.chartData = {
      labels: this.dateList,
      datasets: [
        {
          data: this.dataList1,
          label: 'All Customers',
          borderColor: 'rgb(244, 214, 124)',
          tension: 0.5,
          pointRadius: 0,
          backgroundColor: 'rgba(255, 159, 64, 0.1)',
          fill: true, 
        },
        {
          data: this.dataList2,
          label: 'Loyalty Customers',
          borderColor: '#64D1E3',
          tension: 0.1,
          pointRadius: 0,
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          fill: true, 
        }
      ]
    };
    if (this.chart) {
      this.chart.update();
    }
  }

  public generateLabels(startDate: string, endDate: string) {
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    
    const days: string[] = [];
    while (start <= end) {
      days.push(start.toISOString().split('T')[0]); 
      start.setUTCDate(start.getUTCDate() + 1);
    }
    return days;
  }

  public getSalePerDay(dateList: string[], param?: any, loyalty?: boolean) {
    let grandTotal = 0
    const daySale = dateList.map((day) => {
      const data = this.dataSet[day as keyof DailyData] || [];
      let total = 0
      if (loyalty) {
        total = data.reduce((sum: number, sale: any) => {
          return sale.customerType == 'loyalty' ? sum + sale.amount : sum;
        }, 0);
      } else {
        total = data?.reduce((sum: number, sale: any) => sum + sale.amount, 0);
      }
      grandTotal += total;
      return grandTotal;
    })
    if (loyalty) {
      this.loyaltyFinal = Math.floor(daySale[daySale.length - 1]);
    } else {
      this.allFinal = Math.floor(daySale[daySale.length - 1]);
    }
    return daySale;
  }
}

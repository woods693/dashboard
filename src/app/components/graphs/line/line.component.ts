import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MockData, mockData } from '../../../../assets/data/mock_data';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

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
  public dateList: string[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  constructor() {
    Chart.register(...registerables)
  };

  ngOnInit(): void {
    this.dateList = this.generateLabels(this.startDate, this.endDate);
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['dateList']) {
        this.updateChartData();
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
          minRotation: 45,         // Set minimum rotation to 45 degrees
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
      title: {
        display: true,      // Enable the title
        text: 'Total Sales', // Set the title text
        font: {
          size: 18,
        },
        color: '#333', // Set the title color (optional)
        padding: {
          top: 10,
          bottom: 30, // Set padding for the title
        },
      },
      tooltip: {
        mode: 'nearest',
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true  // Enable zooming with the mouse wheel
          },
          pinch: {
            enabled: true  // Enable zooming with pinch gestures on touch screens
          },
          mode: 'x'       // Zoom both x and y axes
        },
      }
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  };

  updateChartData(){
    this.chartData = {
      labels: this.dateList,
      datasets: [
        {
          data: this.getSalePerDay(this.dateList),
          label: 'All Customers',
          borderColor: 'rgb(244, 214, 124)',
          tension: 0.5,
          pointRadius: 0,
          backgroundColor: 'rgba(255, 159, 64, 0.1)', // Background color under the line
          fill: true, 
        },
        {
          data: this.getLoyaltyPerDay(this.dateList),
          label: 'Loyalty Customers',
          borderColor: '#64D1E3',
          tension: 0.1,
          pointRadius: 0,
          backgroundColor: 'rgba(0, 123, 255, 0.2)', // Background color under the line
          fill: true, 
        }
      ]
    };
    if (this.chart) {
      this.chart.update();  // Ensure chart is updated with the new data
    }
  }

  public generateLabels(startDate: string, endDate: string) {
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    
    const days: string[] = [];
    // Loop through and find all Sundays until endDate
    while (start <= end) {
      days.push(start.toISOString().split('T')[0]); 
      start.setUTCDate(start.getUTCDate() + 1);
    }
    return days;
  }

  public getSalePerDay(dateList: string[], param?: any) {
    let grandTotal = 0
    const daySale = dateList.map((day) => {
      const data = mockData[day as keyof MockData] || [];
      const total = data?.reduce((sum: number, avg: any) => sum + avg.amount, 0);
      grandTotal += total
      return Math.floor(grandTotal);
    })
    return daySale;
  }

  public getLoyaltyPerDay(dateList: string[], param?: any) {
    let grandTotal = 0;
    const weekSale = dateList.map((day) => {
      const data = mockData[day as keyof MockData] || [];
      const total = data.reduce((sum: number, avg: any) => {
        return avg.customer_type == 'loyalty' ? sum + avg.amount : sum;
      }, 0);
      grandTotal += total
      return Math.floor(grandTotal);
    })
    return weekSale;
  }

}

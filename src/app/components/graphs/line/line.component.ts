import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartJSModule } from './chartjs.module';
import { MockData, mockData } from '../../../../assets/data/mock_data';
import { reduce } from 'rxjs';

@Component({
  standalone: true,
  imports: [BaseChartDirective, ChartJSModule],
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrl: './line.component.scss'
})
export class LineComponent implements OnInit{

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit(): void {

  }
  startDate = '2023-01-01';
  endDate = '2024-09-12'
  dateList = this.generateLabels(this.startDate, this.endDate);
  data = this.getAvgOfWeeks(this.dateList);
  public chartType: ChartType = 'line';

  public chartData: ChartConfiguration['data'] = {
    labels: this.dateList,
    datasets: [
      {
        data: this.data,
        label: 'Series A',
        fill: true,
        borderColor: 'blue',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.1
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',  
        beginAtZero: true
      }
    }
  };

  public generateLabels(startDate: string, endDate: string) {
    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T00:00:00Z');
    
    const sundays: string[] = [];
    
    // Adjust start to the first Sunday
    if (start.getUTCDay() !== 0) {
      const daysToAdd = (7 - start.getUTCDay()) % 7;
      start.setUTCDate(start.getUTCDate() + daysToAdd); // Set to the first Sunday
    }
  
    // Loop through and find all Sundays until endDate
    while (start <= end) {
      sundays.push(start.toISOString().split('T')[0]);  // Push Sunday in YYYY-MM-DD format
      start.setUTCDate(start.getUTCDate() + 7); // Add 7 days to get the next Sunday
    }
    return sundays;
  }

  public getAvgOfWeeks(dateList: string[]) {
    const avgSale: number[] = [];
    dateList.forEach((sunday) => {  
      let data = mockData[sunday as keyof MockData]
      let total = 0
      data?.forEach((avg: any) => {
        total = total + avg.amount
      })
      avgSale.push(Math.floor(total))
    })
    return avgSale
  }
}

import { Component, OnInit } from '@angular/core';
import { mockData } from '../../../assets/data/mock_data';
import { LineComponent } from "../graphs/line/line.component";
import { BarComponent } from "../graphs/bar/bar.component";
import { DoughnutComponent } from "../graphs/doughnut/doughnut.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LineComponent, BarComponent, DoughnutComponent, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  startDate: string = '2023-01-01';
  endDate: string = '2024-02-12';
  showCustomDateSelection: boolean = false;

  ngOnInit(): void {
  }

  reset() {
    this.startDate = '2023-01-01';
    this.endDate = '2024-02-12';
  }

  toggleCustomInput() {
    this.showCustomDateSelection = !this.showCustomDateSelection;
  }

  getLastMonth() {
    const today: Date = new Date('2024-11-12'); // hard code todays date for this project. Data is not real

    // Get first day
    const firstDayLastMonth: Date = new Date(today);
    firstDayLastMonth.setMonth(today.getMonth() - 1);
    firstDayLastMonth.setDate(1); // Set to the 1st day of last month

    // Get the last day
    const lastDayLastMonth: Date = new Date(firstDayLastMonth);
    lastDayLastMonth.setMonth(firstDayLastMonth.getMonth() + 1); // Move to next month
    lastDayLastMonth.setDate(0); // Set to the last day of the previous month

    this.startDate = firstDayLastMonth.toISOString().split('T')[0];
    this.endDate = lastDayLastMonth.toISOString().split('T')[0];
  }

  getLastQuarterDates() {
    // 3 months per quarter
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 for Jan, 11 for Dec
    let firstDayLastQuarter: Date;
    let lastDayLastQuarter: Date;
    // Determine the first and last day of the last quarter
    if (currentMonth >= 0 && currentMonth <= 2) { // Jan-Mar (Q1)
      firstDayLastQuarter = new Date(today.getFullYear() - 1, 9, 1); // Last year's Q4: Oct 1
      lastDayLastQuarter = new Date(today.getFullYear() - 1, 11, 31); // Last year's Q4: Dec 31
    } else if (currentMonth >= 3 && currentMonth <= 5) { // Apr-Jun (Q2)
      firstDayLastQuarter = new Date(today.getFullYear(), 0, 1); // Current year's Q1: Jan 1
      lastDayLastQuarter = new Date(today.getFullYear(), 2, 31); // Current year's Q1: Mar 31
    } else if (currentMonth >= 6 && currentMonth <= 8) { // Jul-Sep (Q3)
      firstDayLastQuarter = new Date(today.getFullYear(), 3, 1); // Current year's Q2: Apr 1
      lastDayLastQuarter = new Date(today.getFullYear(), 5, 30); // Current year's Q2: Jun 30
    } else { // Oct-Dec (Q4)
      firstDayLastQuarter = new Date(today.getFullYear(), 6, 1); // Current year's Q3: Jul 1
      lastDayLastQuarter = new Date(today.getFullYear(), 8, 30); // Current year's Q3: Sep 30
    }
  
    this.startDate = firstDayLastQuarter.toISOString().split('T')[0]
    this.endDate = lastDayLastQuarter.toISOString().split('T')[0]
  }

  getLastYearDates() {
    const today = new Date();
    const lastYear = today.getFullYear() - 1;
    // Get first day
    const firstDayLastYear = new Date(lastYear, 0, 1);
    // Get the last day
    const lastDayLastYear = new Date(lastYear, 11, 31);
    this.startDate = firstDayLastYear.toISOString().split('T')[0]
    this.endDate = lastDayLastYear.toISOString().split('T')[0]
  }
  
}

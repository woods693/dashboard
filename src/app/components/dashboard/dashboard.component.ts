import { Component, OnInit } from '@angular/core';
import { LineComponent } from "../graphs/line/line.component";
import { BarComponent } from "../graphs/bar/bar.component";
import { DoughnutComponent } from "../graphs/doughnut/doughnut.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../modal/modal.component";
import { DataService } from '../../services/data.service';
import { DailyData } from '../../services/data.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LineComponent, BarComponent, DoughnutComponent, FormsModule, CommonModule, ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  startDate: string = '';
  endDate: string = '';
  isModalOpen: boolean = false;
  dataSet: DailyData | null = null;
  selectedDataSet: string = 'dataset1';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getThisYearDates();
    this.dataService.getDataSet1().subscribe(data => this.dataSet = data);
  }

  reset() {
    this.getThisYearDates();
  }

  selectDataSet1(){
    this.dataService.getDataSet1().subscribe(data => this.dataSet = data);
  }

  selectDataSet2(){
    this.dataService.getDataSet2().subscribe(data => this.dataSet = data);
  }

  selectDataSet3(){
    this.dataService.getDataSet3().subscribe(data => this.dataSet = data);
  }

  openCustomModal() {
    this.isModalOpen = true;
  }

  closeCustomModal() {
    this.isModalOpen = false;
  }

  onConfirmCustomDate(customDates: { startDate: string, endDate: string }) {
    this.startDate = customDates.startDate;
    this.endDate = customDates.endDate;
    this.closeCustomModal();
  }

  getLastMonth() {
    const today: Date = new Date('2024-11-12'); // hard code todays date for this project. Data is not real

    // Get first day
    const firstDayLastMonth: Date = new Date(today);
    firstDayLastMonth.setMonth(today.getMonth() - 1);
    firstDayLastMonth.setDate(1);

    // Get the last day
    const lastDayLastMonth: Date = new Date(firstDayLastMonth);
    lastDayLastMonth.setMonth(firstDayLastMonth.getMonth() + 1);
    lastDayLastMonth.setDate(0);

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
    this.startDate = firstDayLastYear.toISOString().split('T')[0];
    this.endDate = lastDayLastYear.toISOString().split('T')[0];
  }
  
  getThisYearDates() {
    const today = new Date();
    const year = today.getFullYear()
    const firstDayOfYear = new Date(year, 0, 1);
    this.startDate = firstDayOfYear.toISOString().split('T')[0];
    this.endDate = '2024-11-12'; //endDate is hard coded because the data is not real.
  }
}

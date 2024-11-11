import { Component, OnInit } from '@angular/core';
import { mockData } from '../../../assets/data/mock_data';
import { LineComponent } from "../graphs/line/line.component";
import { BarComponent } from "../graphs/bar/bar.component";
import { DoughnutComponent } from "../graphs/doughnut/doughnut.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LineComponent, BarComponent, DoughnutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  public startDate: string = '2023-01-01';
  public endDate: string = '2024-02-12';

  ngOnInit(): void {
  }
}

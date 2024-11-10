import { Component, OnInit } from '@angular/core';
import { mockData } from '../../../assets/data/mock_data';
import { LineComponent } from "../graphs/line/line.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LineComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  data: any = mockData;

  ngOnInit(): void {
      
  }
}

import { NgModule } from '@angular/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController, // Import LineController
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the necessary components here
ChartJS.register(
  CategoryScale,  // Register category scale
  LinearScale,    // Register linear scale
  PointElement,   // Register point element for line chart
  LineElement,    // Register line element for line chart
  LineController, // Register line controller
  Title,          // Register chart title
  Tooltip,        // Register tooltip
  Legend          // Register legend
);

@NgModule({
  imports: [],
  exports: []
})
export class ChartJSModule {}

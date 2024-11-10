import { bootstrapApplication } from '@angular/platform-browser';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


  bootstrapApplication(AppComponent, {
    providers: [provideCharts(withDefaultRegisterables())],
  }).catch((err) => console.error(err));

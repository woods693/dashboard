import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailyData } from './data.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiBaseUrl = 'http://localhost:5109/api/items';
  constructor(private http: HttpClient) { }

  getDataSet1(): Observable<DailyData> {
    return this.http.get<DailyData>(`${this.apiBaseUrl}/data1`);
  }

  getDataSet2(): Observable<DailyData> {
    return this.http.get<DailyData>(`${this.apiBaseUrl}/data2`);
  }

  getDataSet3(): Observable<DailyData> {
    return this.http.get<DailyData>(`${this.apiBaseUrl}/data3`);
  }

}

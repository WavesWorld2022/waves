import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private weatherApiKey = 'd124d096e66dd926c2b732d56f2860d2';
  private actualWaterTemp!: number;


  constructor(
      private http: HttpClient
  ) { }

  getWeatherData(lat: any, lng: any) {
    return this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.weatherApiKey}&units=metric`);
  }
}

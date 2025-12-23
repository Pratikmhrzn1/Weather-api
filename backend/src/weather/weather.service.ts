import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const key = this.configService.get<string>('WEATHER_API_KEY');
    
    
    if (!key) {
      throw new Error('Weather api key not found!');
    }
    
    this.apiKey = key;
    console.log('API Key exists!');
  }

  async getWeatherByCity(city: string) {
    try {
      const url = `${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
      console.log('Fetching weather for:', city);
      console.log(' API URL:', url.replace(this.apiKey, 'HIDDEN'));
      const response = await firstValueFrom(
        this.httpService.get(url)
      );
      
      console.log('Weather data received successfully');
      
      return {
        name: response.data.name,
        country: response.data.sys.country,
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        condition: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        visibility: response.data.visibility,
      };
    } 
    catch (error) {
      console.error('Error fetching weather:');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      
      if (error.response?.status === 404) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }
      
      if (error.response?.status === 401) {
        throw new HttpException(
          'Invalid API key',
          HttpStatus.UNAUTHORIZED
        );
      }
      
      throw new HttpException(
        `Failed to fetch weather data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
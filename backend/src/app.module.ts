import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
@Module({
  imports: [
    // Enable environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigService available everywhere
    }),
    WeatherModule,
  ],
})
export class AppModule {}

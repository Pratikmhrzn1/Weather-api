import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Debug: Print environment variables
  // console.log('🔍 Environment Check:');
  // console.log('WEATHER_API_KEY exists:', !!process.env.WEATHER_API_KEY);
  // console.log('WEATHER_API_KEY length:', process.env.WEATHER_API_KEY?.length || 0);
  
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  console.log(`The API is running in port ${process.env.PORT}`);
}
bootstrap();
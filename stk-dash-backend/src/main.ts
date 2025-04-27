import * as dotenv from 'dotenv';
// Load the correct environment file based on NODE_ENV
const environment = process.env.NODE_ENV;
dotenv.config({ path: `.env.${environment}` });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  app.enableCors();

  const port = process.env.PORT;
  await app.listen(port || 3000);
  // console.log(process.env);
  // console.log('API_KEY:', process.env.API_KEY);
  // console.log('API_URL:', process.env.API_URL);
}
bootstrap();

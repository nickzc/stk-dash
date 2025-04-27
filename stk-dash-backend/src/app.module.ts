import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StocksModule } from './stocks/stocks.module';
import * as dotenv from 'dotenv';
const environment = process.env.NODE_ENV;
dotenv.config({ path: `.env.${environment}` });
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env', // Fallback to plain .env file
      ],
      isGlobal: true,
    }),
    StocksModule,
  ],
})
export class AppModule {}

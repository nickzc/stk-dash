import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    StocksModule,
  ],
})
export class AppModule {}

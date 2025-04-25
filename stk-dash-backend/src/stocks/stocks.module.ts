import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000, // timeout in milliseconds
      maxRedirects: 5, // maximum number of redirects
    }),
    ConfigModule,
  ],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [StocksService],
})
export class StocksModule {}

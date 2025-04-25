import {
  Controller,
  Get,
  Logger,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksResponse } from './interfaces/stocks.interface';

@Controller('api')
export class StocksController {
  private readonly logger = new Logger(StocksController.name);

  constructor(private readonly stocksService: StocksService) {}

  /**
   * getstocks
   * @returns { success: boolean; data?: StockQuote[]; message?: string; error?: string }
   */
  @Get('stocks')
  @HttpCode(HttpStatus.OK) // Set the response status code to 200 OK
  async getStocks(): Promise<StocksResponse> {
    try {
      const stocks = await this.stocksService.getDefaultStocksQuotes();
      return {
        success: true,
        data: stocks,
      };
    } catch (error) {
      this.logger.error(`Error in getStocks controller: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch stock data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

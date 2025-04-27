import {
  Controller,
  Get,
  Logger,
  HttpException,
  HttpStatus,
  HttpCode,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksResponse } from './types/stocks';
import { StockDetailResponse } from './types/stocks.detail';
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
      this.logger.error(
        `Failed to fetch stock data. Error in getStocks controller: ${error.message}`,
      );
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let errorMessage = 'Failed to fetch stock data';
      if (error instanceof HttpException) {
        throw error;
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        // Handle connection issues with external services
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        errorMessage = 'Stock data service currently unavailable';
      } else if (error.response?.status === 403) {
        // Handle authorization errors from external APIs
        statusCode = HttpStatus.FORBIDDEN;
        errorMessage = 'Access to stock data is restricted';
      } else if (error.response?.status === 429) {
        // Handle rate limiting
        statusCode = HttpStatus.TOO_MANY_REQUESTS;
        errorMessage = 'Rate limit exceeded for stock data service';
      }
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

  /**
   * getStockDetail
   * @param symbol Stock symbol as string
   * @returns
   */
  @Get('stocks/:symbol')
  @HttpCode(HttpStatus.OK)
  async getStockDetail(
    @Param('symbol') symbol: string,
  ): Promise<StockDetailResponse> {
    //if symbol is not provided or is not a string, throw a BadRequestException
    if (!symbol || typeof symbol !== 'string') {
      throw new BadRequestException({
        success: false,
        message: 'Invalid stock symbol',
        error: 'Stock symbol is required and must be a string',
      });
    }

    try {
      const stockDetail = await this.stocksService.getStockDetail(symbol);
      return {
        success: true,
        data: stockDetail,
      };
    } catch (error) {
      this.logger.error(`Error in getStockDetail controller: ${error.message}`);
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let errorMessage = 'Failed to fetch stock data';
      if (error instanceof HttpException) {
        throw error;
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        // Handle connection issues with external services
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        errorMessage = 'Stock data service currently unavailable';
      } else if (error.response?.status === 403) {
        // Handle authorization errors from external APIs
        statusCode = HttpStatus.FORBIDDEN;
        errorMessage = 'Access to stock data is restricted';
      } else if (error.response?.status === 429) {
        // Handle rate limiting
        statusCode = HttpStatus.TOO_MANY_REQUESTS;
        errorMessage = 'Rate limit exceeded for stock data service';
      }
      throw new HttpException(
        {
          success: false,
          message: `Failed to fetch stock details for ${symbol}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

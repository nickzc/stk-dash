import { Injectable, Logger } from '@nestjs/common';
//axios is used to make HTTP requests
import { HttpService } from '@nestjs/axios';
//rxjs is used to handle the response from the API
import { catchError, firstValueFrom } from 'rxjs';

import { AxiosError } from 'axios';

import {
  DEFAULT_STOCKS,
  ALPHA_VANTAGE_API_KEY,
  ALPHA_VANTAGE_BASE_URL,
} from './constants/stocks.constants';
import { StockQuote, StockQuoteResponse } from './interfaces/stocks.interface';

@Injectable()
export class StocksService {
  //logger for logging errors and information
  private readonly logger = new Logger(StocksService.name);
  constructor(private readonly httpService: HttpService) {}

  /**
   * getStockQuote
   * @param symbol stock symbol
   * @returns stock quote data
   */
  async getStockQuote(symbol: string): Promise<StockQuoteResponse> {
    try {
      // Construct the API URL
      const apiUrl = `${ALPHA_VANTAGE_BASE_URL}function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const { data } = await firstValueFrom(
        // Make the API call using HttpService
        this.httpService.get<StockQuoteResponse>(apiUrl).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Error fetching quote for ${symbol}: ${error.message}`,
            );
            throw new Error(
              `Failed to fetch data for ${symbol}: ${error.message}`,
            );
          }),
        ),
      );

      return data;
    } catch (error) {
      this.logger.error(
        `Failed to get stock quote for ${symbol}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * getDefaultStocksQuotes
   * @returns default stocks quotes
   */
  async getDefaultStocksQuotes(): Promise<StockQuote[]> {
    try {
      const results: StockQuote[] = [];

      for (const stock of DEFAULT_STOCKS) {
        try {
          const quoteData = await this.getStockQuote(stock.symbol);

          // handle API response
          const globalQuote = quoteData['Global Quote'] || {};

          // if the API response is empty or doesn't contain the expected data
          if (!globalQuote || Object.keys(globalQuote).length === 0) {
            results.push({
              symbol: stock.symbol,
              name: stock.name,
              error: 'No data returned from API',
            });
            continue;
          }

          // parse the data
          results.push({
            symbol: stock.symbol,
            name: stock.name,
            price: parseFloat(globalQuote['05. price']) || 0,
            change: parseFloat(globalQuote['09. change']) || 0,
            changePercent: globalQuote['10. change percent']
              ? parseFloat(globalQuote['10. change percent'].replace('%', ''))
              : 0,
            volume: parseInt(globalQuote['06. volume']) || 0,
            latestTradingDay: globalQuote['07. latest trading day'] || '',
            previousClose: parseFloat(globalQuote['08. previous close']) || 0,
            open: parseFloat(globalQuote['02. open']) || 0,
            high: parseFloat(globalQuote['03. high']) || 0,
            low: parseFloat(globalQuote['04. low']) || 0,
          });

          // to avoid hitting the API rate limit
          if (DEFAULT_STOCKS.indexOf(stock) < DEFAULT_STOCKS.length - 1) {
            const isDev = process.env.NODE_ENV === 'development';
            await new Promise((resolve) =>
              setTimeout(resolve, isDev ? 50 : 100),
            );
          }
        } catch (err) {
          this.logger.error(
            `Failed to fetch data for ${stock.symbol}: ${err.message}`,
          );
          results.push({
            symbol: stock.symbol,
            name: stock.name,
            error: err instanceof Error ? err.message : 'Failed to fetch data',
          });
        }
      }

      return results;
    } catch (error) {
      this.logger.error(`Error fetching stock quotes: ${error.message}`);
      throw error;
    }
  }
}

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
import {
  StockDetail,
  StockOverviewResponse,
  StockQuote,
  StockQuoteResponse,
  StockTimeSeriesResponse,
} from './interfaces/stocks.interface';

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

  /**
   * get stock historical data
   * @param symbol symbol
   * @returns historical data
   */
  async getStockTimeSeries(symbol: string): Promise<StockTimeSeriesResponse> {
    try {
      // construct the API URL
      const apiUrl = `${ALPHA_VANTAGE_BASE_URL}function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&datatype=json&apikey=${ALPHA_VANTAGE_API_KEY}`;

      const { data } = await firstValueFrom(
        this.httpService.get<StockTimeSeriesResponse>(apiUrl).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Error fetching time series for ${symbol}: ${error.message}`,
            );
            throw new Error(
              `Failed to fetch time series data for ${symbol}: ${error.message}`,
            );
          }),
        ),
      );

      return data;
    } catch (error) {
      this.logger.error(
        `Failed to get stock time series for ${symbol}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * get stock overview
   * @param symbol symbol
   * @returns stock overview
   */
  async getStockOverview(symbol: string): Promise<StockOverviewResponse> {
    try {
      // 构建 API URL
      const apiUrl = `${ALPHA_VANTAGE_BASE_URL}function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

      const { data } = await firstValueFrom(
        this.httpService.get<StockOverviewResponse>(apiUrl).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Error fetching overview for ${symbol}: ${error.message}`,
            );
            throw new Error(
              `Failed to fetch overview data for ${symbol}: ${error.message}`,
            );
          }),
        ),
      );

      return data;
    } catch (error) {
      this.logger.error(
        `Failed to get stock overview for ${symbol}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * get stock detail
   * @param symbol stock symbol
   * @returns stock detail data
   */
  async getStockDetail(symbol: string): Promise<StockDetail> {
    try {
      //get default stock name
      const defaultStock = DEFAULT_STOCKS.find(
        (stock) => stock.symbol === symbol,
      );
      const stockName = defaultStock?.name || '';

      // create a result object
      const result: StockDetail = {
        symbol,
        name: stockName,
      };
      // get stock overview data
      try {
        const overviewData = await this.getStockOverview(symbol);
        // Check if the API returned valid data
        if (overviewData && Object.keys(overviewData).length > 0) {
          // Update company name if API returns a different one than our default
          result.name = overviewData.Name || result.name;

          // Company basic information section
          result.description = overviewData.Description; // Full business description and overview
          result.exchange = overviewData.Exchange; // Stock exchange where shares are traded (NYSE, NASDAQ, etc.)
          result.currency = overviewData.Currency; // Currency used for stock price and financial figures
          result.country = overviewData.Country; // Country where company is headquartered
          result.sector = overviewData.Sector; // Broad market sector (Technology, Healthcare, etc.)
          result.industry = overviewData.Industry; // Specific industry classification within sector
          result.address = overviewData.Address; // Company's headquarters physical address
          result.website = overviewData.OfficialSite; // URL to company's official website
          result.fiscalYearEnd = overviewData.FiscalYearEnd; // Month when company ends its fiscal year
          result.latestQuarter = overviewData.LatestQuarter; // Most recent fiscal quarter with reported earnings

          // Financial metrics and valuation indicators
          result.marketCap =
            parseFloat(overviewData.MarketCapitalization) || undefined; // Total market value of all shares outstanding
          result.ebitda = parseFloat(overviewData.EBITDA) || undefined; // Earnings Before Interest, Taxes, Depreciation & Amortization
          result.peRatio = parseFloat(overviewData.PERatio) || undefined; // Price-to-Earnings ratio - key valuation metric
          result.pegRatio = parseFloat(overviewData.PEGRatio) || undefined; // PE ratio adjusted for expected earnings growth
          result.bookValue = parseFloat(overviewData.BookValue) || undefined; // Net asset value per share
          result.dividendPerShare =
            parseFloat(overviewData.DividendPerShare) || undefined; // Dollar amount paid to shareholders per share
          result.dividendYield =
            parseFloat(overviewData.DividendYield) || undefined; // Annual dividend as percentage of share price
          result.eps = parseFloat(overviewData.EPS) || undefined; // Earnings Per Share - net income divided by shares outstanding
          result.revenuePerShare =
            parseFloat(overviewData.RevenuePerShareTTM) || undefined; // Total revenue divided by shares outstanding
          result.profitMargin =
            parseFloat(overviewData.ProfitMargin) || undefined; // Percentage of revenue that becomes profit
          result.operatingMargin =
            parseFloat(overviewData.OperatingMarginTTM) || undefined; // Percentage of revenue left after operating expenses
          result.returnOnAssets =
            parseFloat(overviewData.ReturnOnAssetsTTM) || undefined; // Profit generated by company assets
          result.returnOnEquity =
            parseFloat(overviewData.ReturnOnEquityTTM) || undefined; // Profit generated relative to shareholder investment
          result.revenue = parseFloat(overviewData.RevenueTTM) || undefined; // Total sales revenue for trailing 12 months
          result.grossProfit =
            parseFloat(overviewData.GrossProfitTTM) || undefined; // Revenue minus cost of goods sold

          // Technical indicators and market performance metrics
          result.beta = parseFloat(overviewData.Beta) || undefined; // Measure of stock volatility compared to overall market
          result.fiftyTwoWeekHigh =
            parseFloat(overviewData['52WeekHigh']) || undefined; // Highest stock price in past 52 weeks
          result.fiftyTwoWeekLow =
            parseFloat(overviewData['52WeekLow']) || undefined; // Lowest stock price in past 52 weeks
          result.fiftyDayMA =
            parseFloat(overviewData['50DayMovingAverage']) || undefined; // Average closing price over last 50 trading days
          result.twoHundredDayMA =
            parseFloat(overviewData['200DayMovingAverage']) || undefined; // Average closing price over last 200 trading days
          result.sharesOutstanding =
            parseFloat(overviewData.SharesOutstanding) || undefined; // Total number of shares available for trading

          // Analyst sentiment and price targets
          result.analystTargetPrice =
            parseFloat(overviewData.AnalystTargetPrice) || undefined; // Average price target from Wall Street analysts
          result.analystRatings = {
            strongBuy: parseInt(overviewData.AnalystRatingStrongBuy) || 0, // Number of analysts with "Strong Buy" recommendation
            buy: parseInt(overviewData.AnalystRatingBuy) || 0, // Number of analysts with "Buy" recommendation
            hold: parseInt(overviewData.AnalystRatingHold) || 0, // Number of analysts with "Hold" recommendation
            sell: parseInt(overviewData.AnalystRatingSell) || 0, // Number of analysts with "Sell" recommendation
            strongSell: parseInt(overviewData.AnalystRatingStrongSell) || 0, // Number of analysts with "Strong Sell" recommendation
          };
        }
      } catch (err) {
        this.logger.warn(
          `Could not fetch overview data for ${symbol}: ${err.message}`,
        );
      }

      // try to get historical data
      try {
        const timeSeriesData = await this.getStockTimeSeries(symbol);

        if (timeSeriesData && timeSeriesData['Time Series (Daily)']) {
          const timeSeries = timeSeriesData['Time Series (Daily)'];

          // parse the time series data and sort it
          result.historicalData = Object.entries(timeSeries)
            .map(([date, data]) => ({
              date,
              open: parseFloat(data['1. open']),
              high: parseFloat(data['2. high']),
              low: parseFloat(data['3. low']),
              close: parseFloat(data['4. close']),
              volume: parseInt(data['5. volume'], 10),
            }))
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
        }
      } catch (err) {
        this.logger.warn(
          `Could not fetch time series data for ${symbol}: ${err.message}`,
        );
      }

      // if no data is available, set an error message
      if (
        (!result.description || result.description.length === 0) &&
        (!result.historicalData || result.historicalData.length === 0)
      ) {
        result.error = `No data available for ${symbol}`;
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to get stock details for ${symbol}: ${error.message}`,
      );
      return {
        symbol,
        name: symbol,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch stock details',
      };
    }
  }
}

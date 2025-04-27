import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { StocksService } from './stocks.service';
import { of, throwError } from 'rxjs';
import { Logger } from '@nestjs/common';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { StockQuoteResponse, StockTimeSeriesResponse } from './types/stocks';
import { StockOverviewResponse } from './types/stocks.detail';
describe('StocksService', () => {
  let service: StocksService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StocksService>(StocksService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStockQuote', () => {
    it('should successfully fetch stock quote data', async () => {
      const mockResponse: StockQuoteResponse = {
        'Global Quote': {
          '01. symbol': 'AAPL',
          '02. open': '170.0',
          '03. high': '175.0',
          '04. low': '169.0',
          '05. price': '174.5',
          '06. volume': '80000000',
          '07. latest trading day': '2023-08-01',
          '08. previous close': '170.0',
          '09. change': '4.5',
          '10. change percent': '2.6%',
        },
      };

      //create a mock response
      const axiosResponse: AxiosResponse = {
        data: mockResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() } as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

      const result = await service.getStockQuote('AAPL');
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => new Error('API error')));

      await expect(service.getStockQuote('AAPL')).rejects.toThrow('API error');
    });
  });

  describe('getStockTimeSeries', () => {
    it('should fetch time series data successfully', async () => {
      const mockTimeSeriesResponse: StockTimeSeriesResponse = {
        'Meta Data': {
          '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
          '2. Symbol': 'AAPL',
          '3. Last Refreshed': '2023-08-01',
          '4. Output Size': 'Compact',
          '5. Time Zone': 'US/Eastern',
        },
        'Time Series (Daily)': {
          '2023-08-01': {
            '1. open': '170.5',
            '2. high': '175.1',
            '3. low': '170.0',
            '4. close': '174.5',
            '5. volume': '75000000',
          },
          '2023-07-31': {
            '1. open': '169.0',
            '2. high': '171.2',
            '3. low': '168.5',
            '4. close': '170.5',
            '5. volume': '65000000',
          },
        },
      };

      const axiosResponse: AxiosResponse = {
        data: mockTimeSeriesResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() } as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

      const result = await service.getStockTimeSeries('AAPL');
      expect(result).toEqual(mockTimeSeriesResponse);
    });
  });

  describe('getStockOverview', () => {
    it('should fetch stock overview data successfully', async () => {
      const mockOverviewResponse: StockOverviewResponse = {
        Symbol: 'AAPL',
        Name: 'Apple Inc.',
        Description:
          'Apple Inc. designs, manufactures, and markets smartphones.',
        Exchange: 'NASDAQ',
        Currency: 'USD',
        Country: 'USA',
        Sector: 'Technology',
        Industry: 'Consumer Electronics',
        Address: '1 Apple Park Way, Cupertino, CA',
        FiscalYearEnd: 'September',
        LatestQuarter: '2023-06-30',
        MarketCapitalization: '2800000000000',
        EBITDA: '125000000000',
        PERatio: '28.5',
        PEGRatio: '2.5',
        BookValue: '4.5',
        DividendPerShare: '0.92',
        DividendYield: '0.52',
        EPS: '6.12',
        RevenuePerShareTTM: '24.5',
        ProfitMargin: '0.25',
        OperatingMarginTTM: '0.30',
        ReturnOnAssetsTTM: '0.20',
        ReturnOnEquityTTM: '0.35',
        RevenueTTM: '394000000000',
        GrossProfitTTM: '170000000000',
        Beta: '1.2',
        '52WeekHigh': '198.23',
        '52WeekLow': '124.17',
        '50DayMovingAverage': '175.34',
        '200DayMovingAverage': '165.67',
        SharesOutstanding: '16000000000',
        AnalystTargetPrice: '190.00',
        AnalystRatingStrongBuy: '15',
        AnalystRatingBuy: '10',
        AnalystRatingHold: '5',
        AnalystRatingSell: '2',
        AnalystRatingStrongSell: '1',
        OfficialSite: 'https://www.apple.com',
        DilutedEPSTTM: '',
        QuarterlyEarningsGrowthYOY: '',
        QuarterlyRevenueGrowthYOY: '',
        TrailingPE: '',
        ForwardPE: '',
        PriceToSalesRatioTTM: '',
        PriceToBookRatio: '',
        EVToRevenue: '',
        EVToEBITDA: '',
        DividendDate: '',
        ExDividendDate: '',
      };

      const axiosResponse: AxiosResponse = {
        data: mockOverviewResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: new AxiosHeaders() } as any,
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(axiosResponse));

      const result = await service.getStockOverview('AAPL');
      expect(result).toEqual(mockOverviewResponse);
    });
  });

  describe('getStockDetail', () => {
    it('should combine overview and time series data', async () => {
      // simulate getStockOverview response
      const mockOverviewResponse: StockOverviewResponse = {
        Symbol: 'AAPL',
        Name: 'Apple Inc.',
        Description:
          'Apple Inc. designs, manufactures, and markets smartphones.',
        Exchange: 'NASDAQ',
        Currency: 'USD',
        Country: 'USA',
        Sector: 'Technology',
        Industry: 'Consumer Electronics',
        Address: '1 Apple Park Way, Cupertino, CA',
        FiscalYearEnd: 'September',
        LatestQuarter: '2023-06-30',
        MarketCapitalization: '2800000000000',
        EBITDA: '125000000000',
        PERatio: '28.5',
        PEGRatio: '2.5',
        BookValue: '4.5',
        DividendPerShare: '0.92',
        DividendYield: '0.52',
        EPS: '6.12',
        RevenuePerShareTTM: '24.5',
        ProfitMargin: '0.25',
        OperatingMarginTTM: '0.30',
        ReturnOnAssetsTTM: '0.20',
        ReturnOnEquityTTM: '0.35',
        RevenueTTM: '394000000000',
        GrossProfitTTM: '170000000000',
        Beta: '1.2',
        '52WeekHigh': '198.23',
        '52WeekLow': '124.17',
        '50DayMovingAverage': '175.34',
        '200DayMovingAverage': '165.67',
        SharesOutstanding: '16000000000',
        AnalystTargetPrice: '190.00',
        AnalystRatingStrongBuy: '15',
        AnalystRatingBuy: '10',
        AnalystRatingHold: '5',
        AnalystRatingSell: '2',
        AnalystRatingStrongSell: '1',
        OfficialSite: 'https://www.apple.com',
        DilutedEPSTTM: '',
        QuarterlyEarningsGrowthYOY: '',
        QuarterlyRevenueGrowthYOY: '',
        TrailingPE: '',
        ForwardPE: '',
        PriceToSalesRatioTTM: '',
        PriceToBookRatio: '',
        EVToRevenue: '',
        EVToEBITDA: '',
        DividendDate: '',
        ExDividendDate: '',
      };

      jest
        .spyOn(service, 'getStockOverview')
        .mockResolvedValueOnce(mockOverviewResponse);

      // simulate getStockTimeSeries response
      const mockTimeSeriesResponse: StockTimeSeriesResponse = {
        'Meta Data': {
          '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
          '2. Symbol': 'AAPL',
          '3. Last Refreshed': '2023-08-01',
          '4. Output Size': 'Compact',
          '5. Time Zone': 'US/Eastern',
        },
        'Time Series (Daily)': {
          '2023-08-01': {
            '1. open': '170.5',
            '2. high': '175.1',
            '3. low': '170.0',
            '4. close': '174.5',
            '5. volume': '75000000',
          },
        },
      };

      jest
        .spyOn(service, 'getStockTimeSeries')
        .mockResolvedValueOnce(mockTimeSeriesResponse);

      const result = await service.getStockDetail('AAPL');

      expect(result).toMatchObject({
        symbol: 'AAPL',
        name: 'Apple Inc.',
        description:
          'Apple Inc. designs, manufactures, and markets smartphones.',
        exchange: 'NASDAQ',
        currency: 'USD',
        historicalData: expect.arrayContaining([
          expect.objectContaining({
            date: '2023-08-01',
            open: 170.5,
            close: 174.5,
          }),
        ]),
      });
    });

    it('should handle errors in overview data fetch', async () => {
      // simulate error in getStockOverview
      jest
        .spyOn(service, 'getStockOverview')
        .mockRejectedValueOnce(new Error('API error'));

      // simulate successful getStockTimeSeries
      const mockTimeSeriesResponse: StockTimeSeriesResponse = {
        'Meta Data': {
          '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
          '2. Symbol': 'AAPL',
          '3. Last Refreshed': '2023-08-01',
          '4. Output Size': 'Compact',
          '5. Time Zone': 'US/Eastern',
        },
        'Time Series (Daily)': {
          '2023-08-01': {
            '1. open': '170.5',
            '2. high': '175.1',
            '3. low': '170.0',
            '4. close': '174.5',
            '5. volume': '75000000',
          },
        },
      };

      jest
        .spyOn(service, 'getStockTimeSeries')
        .mockResolvedValueOnce(mockTimeSeriesResponse);

      const result = await service.getStockDetail('AAPL');

      // should have historical data but no company info
      expect(result.description).toBeUndefined();
      expect(result.historicalData).toBeDefined();
    });

    it('should handle errors in time series data fetch', async () => {
      // simulate successful getStockOverview
      const mockOverviewResponse: StockOverviewResponse = {
        Symbol: 'AAPL',
        Name: 'Apple Inc.',
        Description:
          'Apple Inc. designs, manufactures, and markets smartphones.',
        Exchange: 'NASDAQ',
        Currency: 'USD',
        Country: 'USA',
        Sector: 'Technology',
        Industry: 'Consumer Electronics',
        Address: '1 Apple Park Way, Cupertino, CA',
        FiscalYearEnd: 'September',
        LatestQuarter: '2023-06-30',
        MarketCapitalization: '2800000000000',
        EBITDA: '125000000000',
        PERatio: '28.5',
        PEGRatio: '2.5',
        BookValue: '4.5',
        DividendPerShare: '0.92',
        DividendYield: '0.52',
        EPS: '6.12',
        RevenuePerShareTTM: '24.5',
        ProfitMargin: '0.25',
        OperatingMarginTTM: '0.30',
        ReturnOnAssetsTTM: '0.20',
        ReturnOnEquityTTM: '0.35',
        RevenueTTM: '394000000000',
        GrossProfitTTM: '170000000000',
        Beta: '1.2',
        '52WeekHigh': '198.23',
        '52WeekLow': '124.17',
        '50DayMovingAverage': '175.34',
        '200DayMovingAverage': '165.67',
        SharesOutstanding: '16000000000',
        AnalystTargetPrice: '190.00',
        AnalystRatingStrongBuy: '15',
        AnalystRatingBuy: '10',
        AnalystRatingHold: '5',
        AnalystRatingSell: '2',
        AnalystRatingStrongSell: '1',
        OfficialSite: 'https://www.apple.com',
        DilutedEPSTTM: '',
        QuarterlyEarningsGrowthYOY: '',
        QuarterlyRevenueGrowthYOY: '',
        TrailingPE: '',
        ForwardPE: '',
        PriceToSalesRatioTTM: '',
        PriceToBookRatio: '',
        EVToRevenue: '',
        EVToEBITDA: '',
        DividendDate: '',
        ExDividendDate: '',
      };

      jest
        .spyOn(service, 'getStockOverview')
        .mockResolvedValueOnce(mockOverviewResponse);

      // simulate error in getStockTimeSeries
      jest
        .spyOn(service, 'getStockTimeSeries')
        .mockRejectedValueOnce(new Error('API error'));

      const result = await service.getStockDetail('AAPL');

      // should have company info but no historical data
      expect(result.description).toBeDefined();
      expect(result.historicalData).toBeUndefined();
    });
  });
});

export interface StockData {
  symbol: string;
  name: string;
}

//Stock quote response format from Alpha Vantage API
export interface StockQuoteResponse {
  'Global Quote': {
    // The symbol of the stock
    '01. symbol': string;
    // The open price of the stock
    '02. open': string;
    // The high price of the stock
    '03. high': string;
    // The low price of the stock
    '04. low': string;
    // The latest price of the stock
    '05. price': string;
    '06. volume': string;
    // The latest trading day
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

// Stock time series response format from Alpha Vantage API
export interface StockTimeSeriesResponse {
  'Time Series (Daily)': {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  };
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
}

//stock quote data used internally by the application
export interface StockQuote {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  //changePercent is a percentage value, so it should be a number
  changePercent?: number;
  volume?: number;
  // The latest trading day
  latestTradingDay?: string;
  previousClose?: number;
  open?: number;
  high?: number;
  low?: number;
  error?: string;
}

export interface StocksResponse {
  success: boolean;
  // list of stock quotes
  data?: StockQuote[];
  message?: string;
  error?: string;
}

export interface StockOverviewResponse {
  // The trading symbol for the company
  Symbol: string;
  // The full company name
  Name: string;
  // Detailed description of the company's business and operations
  Description: string;
  // The stock exchange where the company is listed (e.g., NYSE, NASDAQ)
  Exchange: string;
  // The currency in which the stock is traded (e.g., USD, EUR)
  Currency: string;
  // The country where the company is headquartered
  Country: string;
  // The broad economic sector the company operates in (e.g., Technology, Healthcare)
  Sector: string;
  // The specific industry within the sector (e.g., Software, Pharmaceuticals)
  Industry: string;
  // The physical headquarters address of the company
  Address: string;
  // The URL of the company's official website
  OfficialSite: string;
  // The month when the company's fiscal year ends
  FiscalYearEnd: string;
  // The most recent fiscal quarter reported
  LatestQuarter: string;
  // The total market value of the company's outstanding shares
  MarketCapitalization: string;
  // Earnings Before Interest, Taxes, Depreciation, and Amortization - a measure of operational profitability
  EBITDA: string;
  // Price-to-Earnings Ratio - stock price divided by earnings per share
  PERatio: string;
  // Price/Earnings to Growth Ratio - measures the relationship between P/E ratio and earnings growth rate
  PEGRatio: string;
  // The company's net asset value per share
  BookValue: string;
  // The amount of dividend paid per share
  DividendPerShare: string;
  // Annual dividend payment as a percentage of the stock price
  DividendYield: string;
  // Earnings Per Share - the company's profit divided by outstanding shares
  EPS: string;
  // Revenue Per Share for the trailing twelve months
  RevenuePerShareTTM: string;
  // Net profit as a percentage of revenue
  ProfitMargin: string;
  // Operating profit as a percentage of revenue for the trailing twelve months
  OperatingMarginTTM: string;
  // Return on Assets - how efficiently a company uses its assets to generate profit
  ReturnOnAssetsTTM: string;
  // Return on Equity - measures profitability relative to shareholders' equity
  ReturnOnEquityTTM: string;
  // Total revenue for the trailing twelve months
  RevenueTTM: string;
  // Gross profit for the trailing twelve months
  GrossProfitTTM: string;
  // Diluted Earnings Per Share for the trailing twelve months
  DilutedEPSTTM: string;
  // Year-over-year growth in quarterly earnings
  QuarterlyEarningsGrowthYOY: string;
  // Year-over-year growth in quarterly revenue
  QuarterlyRevenueGrowthYOY: string;
  // The median price target from analysts covering the stock
  AnalystTargetPrice: string;
  // Number of analysts with a "Strong Buy" recommendation
  AnalystRatingStrongBuy: string;
  // Number of analysts with a "Buy" recommendation
  AnalystRatingBuy: string;
  // Number of analysts with a "Hold" recommendation
  AnalystRatingHold: string;
  // Number of analysts with a "Sell" recommendation
  AnalystRatingSell: string;
  // Number of analysts with a "Strong Sell" recommendation
  AnalystRatingStrongSell: string;
  // Current P/E ratio based on historical earnings
  TrailingPE: string;
  // P/E ratio based on projected future earnings
  ForwardPE: string;
  // Price-to-Sales Ratio for the trailing twelve months - stock price relative to revenue
  PriceToSalesRatioTTM: string;
  // Price-to-Book Ratio - stock price relative to book value
  PriceToBookRatio: string;
  // Enterprise Value to Revenue ratio - measures company's total value relative to revenue
  EVToRevenue: string;
  // Enterprise Value to EBITDA ratio - indicates how many years it would take for EBITDA to cover the enterprise value
  EVToEBITDA: string;
  // Measure of stock volatility relative to the overall market
  Beta: string;
  // Highest stock price in the last 52 weeks
  '52WeekHigh': string;
  // Lowest stock price in the last 52 weeks
  '52WeekLow': string;
  // Average closing price over the last 50 trading days
  '50DayMovingAverage': string;
  // Average closing price over the last 200 trading days
  '200DayMovingAverage': string;
  // Total number of shares available for public trading
  SharesOutstanding: string;
  // Date when the next dividend will be paid
  DividendDate: string;
  // Date when the stock begins trading without the dividend (i.e., the cut-off date for dividend eligibility)
  ExDividendDate: string;
}
export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Stock detail response format - internal representation of company fundamentals and metrics
export interface StockDetail {
  // The trading symbol for the company (e.g., AAPL, MSFT)
  symbol: string;
  // The full company name (e.g., Apple Inc., Microsoft Corporation)
  name: string;
  // Detailed description of the company's business, products, and operations
  description?: string;
  // The stock exchange where the company is listed (e.g., NYSE, NASDAQ)
  exchange?: string;
  // The currency in which the stock is traded (e.g., USD, EUR)
  currency?: string;
  // The country where the company is headquartered
  country?: string;
  // The broad economic sector the company operates in (e.g., Technology, Healthcare)
  sector?: string;
  // The specific industry within the sector (e.g., Software, Pharmaceuticals)
  industry?: string;
  // The physical headquarters address of the company
  address?: string;
  // The URL of the company's official website
  website?: string;
  // The month when the company's fiscal year ends
  fiscalYearEnd?: string;
  // The most recent fiscal quarter reported
  latestQuarter?: string;

  // Financial data section
  // The total market value of the company's outstanding shares (in currency units)
  marketCap?: number;
  // Earnings Before Interest, Taxes, Depreciation, and Amortization - a measure of operational profitability
  ebitda?: number;
  // Price-to-Earnings Ratio - stock price divided by earnings per share
  peRatio?: number;
  // Price/Earnings to Growth Ratio - measures the relationship between P/E ratio and earnings growth rate
  pegRatio?: number;
  // The company's net asset value per share
  bookValue?: number;
  // The amount of dividend paid per share
  dividendPerShare?: number;
  // Annual dividend payment as a percentage of the stock price
  dividendYield?: number;
  // Earnings Per Share - the company's profit divided by outstanding shares
  eps?: number;
  // Revenue Per Share - total revenue divided by outstanding shares
  revenuePerShare?: number;
  // Net profit as a percentage of revenue - indicates profitability efficiency
  profitMargin?: number;
  // Operating profit as a percentage of revenue - measures operational efficiency
  operatingMargin?: number;
  // Return on Assets - how efficiently a company uses its assets to generate profit
  returnOnAssets?: number;
  // Return on Equity - measures profitability relative to shareholders' equity
  returnOnEquity?: number;
  // Total revenue for the trailing twelve months
  revenue?: number;
  // Gross profit (revenue minus cost of goods sold) for the trailing twelve months
  grossProfit?: number;

  // Market and technical indicators
  // Measure of stock volatility relative to the overall market
  beta?: number;
  // Highest stock price in the last 52 weeks
  fiftyTwoWeekHigh?: number;
  // Lowest stock price in the last 52 weeks
  fiftyTwoWeekLow?: number;
  // Average closing price over the last 50 trading days
  fiftyDayMA?: number;
  // Average closing price over the last 200 trading days
  twoHundredDayMA?: number;
  // Total number of shares available for public trading
  sharesOutstanding?: number;
  // The median price target from analysts covering the stock
  analystTargetPrice?: number;
  // Summary of analyst recommendations for the stock
  analystRatings?: {
    // Number of analysts with a "Strong Buy" recommendation
    strongBuy: number;
    // Number of analysts with a "Buy" recommendation
    buy: number;
    // Number of analysts with a "Hold" recommendation
    hold: number;
    // Number of analysts with a "Sell" recommendation
    sell: number;
    // Number of analysts with a "Strong Sell" recommendation
    strongSell: number;
  };

  // Historical price and volume data points for charting
  historicalData?: HistoricalDataPoint[];

  // Error message if any issue occurred while fetching the stock details
  error?: string;
}

export interface StockDetailResponse {
  success: boolean;
  data?: StockDetail;
  message?: string;
  error?: string;
}

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

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

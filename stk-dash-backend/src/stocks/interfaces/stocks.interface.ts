export interface StockData {
  symbol: string;
  name: string;
}

export interface StockQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

export interface StockQuote {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
  latestTradingDay?: string;
  previousClose?: number;
  open?: number;
  high?: number;
  low?: number;
  error?: string;
}

export interface StocksResponse {
  success: boolean;
  data?: StockQuote[];
  message?: string;
  error?: string;
}

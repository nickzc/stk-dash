// export const DEFAULT_STOCKS = [
//   { symbol: 'AAPL', name: 'Apple Inc.' },
//   { symbol: 'MSFT', name: 'Microsoft Corp.' },
//   { symbol: 'AMZN', name: 'Amazon.com Inc.' },
//   { symbol: 'GOOGL', name: 'Alphabet Inc.-C' },
//   { symbol: 'META', name: 'Meta Platforms Inc.' },
//   { symbol: 'TSLA', name: 'Tesla Inc.' },
//   { symbol: 'BRK.B', name: 'Berkshire Hathaway B' },
//   { symbol: 'BABA', name: 'Alibaba Group' },
//   { symbol: 'ORCL', name: 'Oracle Corp.' },
//   { symbol: 'ADBE', name: 'Adobe Inc.' },
// ];
//Mock a stock list for now; if time allows later, we can extend it to accept multiple stock symbols and generate the list dynamically.
export const DEFAULT_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
];

// Alpha Vantage API Key
export const ALPHA_VANTAGE_API_KEY = 'LLPUXXZ8FW82ORWG';

// Alpha Vantage Base URL
export const ALPHA_VANTAGE_BASE_URL =
  process.env.API_URL ||
  'https://7fb3233e-adce-41f3-9d3b-f065fc177a62.mock.pstmn.io/query?';

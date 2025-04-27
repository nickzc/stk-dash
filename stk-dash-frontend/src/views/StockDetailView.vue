<template>
  <div class="stock-detail">
    <el-page-header @back="goBack" :title="id" content="Stock Details" />

    <!-- Main market information -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="16">
        <stock-price-chart
          :stock-name="stockData.name"
          :stock-code="stockData.code"
          :current-price="stockData.currentPrice"
          :previous-close="stockData.previousClose"
          :historical-data="historicalData"
        />
      </el-col>

      <el-col :span="8" class="company-overview-col">
        <company-overview :stock-data="stockData" />
      </el-col>
    </el-row>

    <!-- Additional company information -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="12">
        <financial-metrics :stock-data="stockData" />
      </el-col>

      <el-col :span="12">
        <technical-indicators :stock-data="stockData" />
      </el-col>
    </el-row>

    <!-- Company Description -->
    <company-description :stock-data="stockData" class="mt-4" />

    <!-- Historical Data -->
    <historical-data-table
      :historical-data="historicalData"
      :raw-historical-data="rawHistoricalData"
      v-model="timeRange"
      @time-range-change="handleTimeRangeChange"
      class="mt-4"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStockDetail } from '../utils/api'
import { formatLargeNumber, calculateDateRange } from '@/utils/formatters'
import { useThemeManager } from '@/utils/ThemeManager'

// Import modularized components
import StockPriceChart from '@/components/StockPriceChart.vue'
import CompanyOverview from '@/components/CompanyOverview.vue'
import FinancialMetrics from '@/components/FinancialMetrics.vue'
import TechnicalIndicators from '@/components/TechnicalIndicators.vue'
import CompanyDescription from '@/components/CompanyDescription.vue'
import HistoricalDataTable from '@/components/HistoricalDataTable.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const timeRange = ref('1m')
const rawHistoricalData = ref([])
const historicalData = ref([])
const isLoading = ref(true)

// Initialize theme manager
const { setupTheme, cleanupTheme } = useThemeManager()

// Stock data ref
const stockData = ref({
  code: id,
  name: 'Loading...',
  // Latest stock price
  currentPrice: 0,
  // Previous day's closing price (for calculating price change)
  previousClose: 0,
  // Industry classification
  industry: '-',
  // Market capitalization (formatted with K/M/B/T)
  marketCap: '-',
  // 52-week high price
  yearHigh: 0,
  // 52-week low price
  yearLow: 0,
  // Average trading volume
  averageVolume: '-',
  // Price-to-earnings ratio
  pe: 0,
  // Dividend yield percentage
  dividendYield: 0,
})

const fetchStockData = async () => {
  try {
    isLoading.value = true
    const response = await getStockDetail(id)

    if (response.success && response.data) {
      const data = response.data

      stockData.value = {
        // Basic stock identification
        code: data.symbol, // Stock symbol (ticker)
        name: data.name, // Company name

        // Core price data - uses historical data array where index 0 is most recent
        currentPrice: parseFloat(data.historicalData[0]?.close || 0),
        previousClose: parseFloat(data.historicalData[1]?.close || 0),

        // Company classification information
        industry: data.industry, // Specific industry category
        marketCap: formatLargeNumber(data.marketCap), // Market capitalization (formatted with K/M/B/T)

        // 52-week trading range
        yearHigh: data.fiftyTwoWeekHigh, // Highest price in past 52 weeks
        yearLow: data.fiftyTwoWeekLow, // Lowest price in past 52 weeks

        // calculates average from all available historical data
        averageVolume: formatLargeNumber(
          data.historicalData.reduce((sum, item) => sum + item.volume, 0) /
            data.historicalData.length, // Average daily trading volume
        ),

        // Valuation metrics
        pe: data.peRatio, // Price-to-earnings ratio
        dividendYield: (data.dividendYield * 100).toFixed(2), // Dividend yield as percentage with 2 decimal places

        // Market information
        exchange: data.exchange, // Stock exchange where traded
        currency: data.currency, // Trading currency (e.g. USD)
        sector: data.sector, // Broader market sector

        // Company information
        description: data.description, // Company business description
        website: data.website, // Company website URL
        address: data.address, // Company headquarters address

        // Additional financial metrics
        eps: data.eps, // Earnings per share
        beta: data.beta, // Stock volatility relative to market
        pegRatio: data.pegRatio, // Price/earnings to growth ratio

        // Profitability metrics (converted to percentages)
        profitMargin: (data.profitMargin * 100).toFixed(2), // Net profit margin percentage
        operatingMargin: (data.operatingMargin * 100).toFixed(2), // Operating margin percentage
        returnOnEquity: (data.returnOnEquity * 100).toFixed(2), // Return on equity percentage
        returnOnAssets: (data.returnOnAssets * 100).toFixed(2), // Return on assets percentage

        // Balance sheet metrics
        bookValue: data.bookValue, // Book value per share

        // Income statement highlights (formatted with K/M/B/T)
        revenue: formatLargeNumber(data.revenue), // Total revenue
        grossProfit: formatLargeNumber(data.grossProfit), // Gross profit

        // Technical analysis indicators
        fiftyDayMA: data.fiftyDayMA, // 50 day moving average price
        twoHundredDayMA: data.twoHundredDayMA, // 200 day moving average price

        // Analyst information
        analystTargetPrice: data.analystTargetPrice, // Average analyst price target

        // Financial reporting dates
        fiscalYearEnd: data.fiscalYearEnd, // Date of fiscal year end
        latestQuarter: data.latestQuarter, // Date of most recent quarterly report
      }
      // Process historical data
      processHistoricalData(data.historicalData)
    }
  } catch (error) {
    console.error('Failed to fetch stock data:', error)
  } finally {
    isLoading.value = false
  }
}

//Processes raw historical stock data from the API into a formatted dataset
const processHistoricalData = (data) => {
  if (!data || !data.length) return

  // Sort data by date descending (newest dates first)
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))

  // Maps each data point and calculates day-to-day changes
  rawHistoricalData.value = sortedData.map((item, index, arr) => {
    // Get previous day's data to calculate price changes
    const prevItem = index < arr.length - 1 ? arr[index + 1] : null

    // Calculate absolute price change from previous day
    const change = prevItem ? parseFloat((item.close - prevItem.close).toFixed(2)) : 0

    // Calculate percentage change from previous day
    const changePercent = prevItem ? parseFloat(((change / prevItem.close) * 100).toFixed(2)) : 0

    // Return formatted data object with consistent decimal precision
    return {
      date: item.date, // Date string
      open: item.open.toFixed(2), // Opening price with 2 decimal places
      high: item.high.toFixed(2), // Highest price with 2 decimal places
      low: item.low.toFixed(2), // Lowest price with 2 decimal places
      close: item.close.toFixed(2), // Closing price with 2 decimal places
      change: change, // Absolute change from previous day
      changePercent: changePercent, // Percentage change from previous day
      volume: formatLargeNumber(item.volume), // Trading volume formatted with K/M/B
    }
  })
  updateFilteredData()
}

const updateFilteredData = () => {
  if (!rawHistoricalData.value.length) return

  const startDate = calculateDateRange(timeRange.value)
  // Filter the data
  historicalData.value = rawHistoricalData.value.filter((item) => new Date(item.date) >= startDate)
}

// Utility functions
const goBack = () => {
  router.push('/')
}

// Handle time range changes
const handleTimeRangeChange = () => {
  updateFilteredData()
}

// Watch for time range changes
watch(timeRange, handleTimeRangeChange)

onMounted(async () => {
  // Setup theme
  setupTheme()

  // Fetch stock data
  await fetchStockData()
})

onUnmounted(() => {
  // Clean up theme
  cleanupTheme()
})
</script>

<style scoped>
.stock-detail {
  padding: 20px;
  background-color: var(--color-background);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 0.3s;
}

.mt-4 {
  margin-top: 20px;
}

/* Layout styles */
.el-row {
  display: flex;
  flex-wrap: wrap;
}

.el-col {
  display: flex;
  flex-direction: column;
}

.el-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-card__body {
  flex: 1;
  overflow: auto;
}

.company-overview-col .el-card + .el-card {
  margin-top: 20px;
}

.el-descriptions-item {
  height: 40px;
}

/* Dark mode styles */
:global(html.dark) .stock-detail {
  background-color: var(--color-background);
}

:global(html.dark) .el-card {
  background-color: var(--color-background-soft);
  border-color: var(--color-border);
}

:global(html.dark) .card-header {
  color: var(--color-text);
}

:global(html.dark) .el-table {
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

:global(html.dark) .el-table tr,
:global(html.dark) .el-table th {
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

:global(html.dark) .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: var(--color-background-mute);
}

:global(html.dark) .el-descriptions,
:global(html.dark) .el-descriptions__body,
:global(html.dark) .el-descriptions__label,
:global(html.dark) .el-descriptions__content {
  color: var(--color-text);
  background-color: var(--color-background-soft);
}

:global(html.dark) .el-page-header__title,
:global(html.dark) .el-page-header__content {
  color: var(--color-text);
}

:global(html.dark) .el-radio-button__inner {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border-color: var(--color-border);
}

:global(html.dark) .el-radio-button__original-radio:checked + .el-radio-button__inner {
  color: #fff;
}
</style>

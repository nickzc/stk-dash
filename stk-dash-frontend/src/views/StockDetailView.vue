<template>
  <div class="stock-detail">
    <el-page-header @back="goBack" :title="id" content="Stock Details" />

    <!-- Main market information -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ stockData.name }} ({{ stockData.code }})</span>
              <div class="price-info">
                <span
                  class="current-price"
                  :class="{ 'price-up': priceChange > 0, 'price-down': priceChange < 0 }"
                >
                  ${{ stockData.currentPrice }}
                </span>
                <span
                  class="price-change"
                  :class="{ 'price-up': priceChange > 0, 'price-down': priceChange < 0 }"
                >
                  {{ priceChange > 0 ? '+' : '' }}{{ priceChange }} ({{ priceChangePercent }}%)
                </span>
              </div>
            </div>
          </template>
          <div class="chart-container" ref="priceChartContainer"></div>
        </el-card>
      </el-col>

      <el-col :span="8" class="company-overview-col">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>Company Overview</span>
            </div>
          </template>
          <div class="company-info">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="Industry">{{ stockData.industry }}</el-descriptions-item>
              <el-descriptions-item label="Sector">{{ stockData.sector }}</el-descriptions-item>
              <el-descriptions-item label="Exchange">{{ stockData.exchange }}</el-descriptions-item>
              <el-descriptions-item label="Currency">{{ stockData.currency }}</el-descriptions-item>
              <el-descriptions-item label="Market Cap"
                >${{ stockData.marketCap }}</el-descriptions-item
              >
              <el-descriptions-item label="52-Week High"
                >${{ stockData.yearHigh }}</el-descriptions-item
              >
              <el-descriptions-item label="52-Week Low"
                >${{ stockData.yearLow }}</el-descriptions-item
              >
              <el-descriptions-item label="Avg. Volume">{{
                stockData.averageVolume
              }}</el-descriptions-item>
              <el-descriptions-item label="Website">
                <a :href="stockData.website" target="_blank">{{ stockData.website }}</a>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Additional company information -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="12">
        <el-card shadow="hover" class="same-height-card">
          <template #header>
            <div class="card-header">
              <span>Financial Metrics</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="P/E Ratio">{{ stockData.pe }}</el-descriptions-item>
            <el-descriptions-item label="PEG Ratio">{{ stockData.pegRatio }}</el-descriptions-item>
            <el-descriptions-item label="EPS">{{ stockData.eps }}</el-descriptions-item>
            <el-descriptions-item label="Book Value">{{
              stockData.bookValue
            }}</el-descriptions-item>
            <el-descriptions-item label="Dividend Yield"
              >{{ stockData.dividendYield }}%</el-descriptions-item
            >
            <el-descriptions-item label="Beta">{{ stockData.beta }}</el-descriptions-item>
            <el-descriptions-item label="Revenue">{{ stockData.revenue }}</el-descriptions-item>
            <el-descriptions-item label="Gross Profit">{{
              stockData.grossProfit
            }}</el-descriptions-item>
            <el-descriptions-item label="Profit Margin"
              >{{ stockData.profitMargin }}%</el-descriptions-item
            >
            <el-descriptions-item label="Operating Margin"
              >{{ stockData.operatingMargin }}%</el-descriptions-item
            >
            <el-descriptions-item label="ROE">{{ stockData.returnOnEquity }}%</el-descriptions-item>
            <el-descriptions-item label="ROA">{{ stockData.returnOnAssets }}%</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="hover" class="same-height-card">
          <template #header>
            <div class="card-header">
              <span>Technical Indicators</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="50-Day MA"
              >${{ stockData.fiftyDayMA }}</el-descriptions-item
            >
            <el-descriptions-item label="200-Day MA"
              >${{ stockData.twoHundredDayMA }}</el-descriptions-item
            >
            <el-descriptions-item label="Target Price"
              >${{ stockData.analystTargetPrice }}</el-descriptions-item
            >
            <el-descriptions-item label="Fiscal Year End">{{
              stockData.fiscalYearEnd
            }}</el-descriptions-item>
            <el-descriptions-item label="Latest Quarter">{{
              stockData.latestQuarter
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <!-- Company Description -->
    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>Company Description</span>
        </div>
      </template>
      <p>{{ stockData.description }}</p>
      <p v-if="stockData.address"><strong>Address:</strong> {{ stockData.address }}</p>
    </el-card>

    <!-- Historical Data -->
    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>Historical Data</span>
          <el-radio-group v-model="timeRange" size="small" @change="handleTimeRangeChange">
            <el-radio-button label="1w">1 Week</el-radio-button>
            <el-radio-button label="1m">1 Month</el-radio-button>
            <el-radio-button label="3m">3 Months</el-radio-button>
            <el-radio-button label="1y">1 Year</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <el-table :data="historicalData" stripe style="width: 100%" height="400" border>
        <el-table-column type="index" width="50" />
        <el-table-column prop="date" label="Date" sortable />
        <el-table-column prop="open" label="Open" sortable />
        <el-table-column prop="high" label="High" sortable />
        <el-table-column prop="low" label="Low" sortable />
        <el-table-column prop="close" label="Close" sortable>
          <template #default="scope">
            <span :class="getColorClass(scope.row.change)">{{ scope.row.close }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="change" label="Change" sortable>
          <template #default="scope">
            <span :class="getColorClass(scope.row.change)">
              {{ scope.row.change > 0 ? '+' : '' }}{{ scope.row.change }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="changePercent" label="% Change" sortable>
          <template #default="scope">
            <span :class="getColorClass(scope.row.change)">
              {{ scope.row.change > 0 ? '+' : '' }}{{ scope.row.changePercent }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="volume" label="Volume" sortable />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { LineChart, BarChart, CandlestickChart, RadarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getStockDetail } from '../utils/api'

// Register required components for ECharts
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  MarkLineComponent,
  LineChart,
  BarChart,
  CandlestickChart,
  RadarChart,
  CanvasRenderer,
])

const route = useRoute()
const router = useRouter()
const id = route.params.id
const timeRange = ref('1m')
const priceChartContainer = ref(null)
const rawHistoricalData = ref([])
// Chart instances Holds the ECharts instance for the stock price chart
let priceChartInstance = null
// Metrics chart instance Holds the ECharts instance for the financial metrics chart
let metricsChartInstance = null
const historicalData = ref([])
//whether the request is loading
const isLoading = ref(true)

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

// priceChange: Computed property that calculates the absolute dollar change in stock price
// from the previous trading day's close price to the current price
const priceChange = computed(() => {
  // Return 0 if either current price or previous close is missing/invalid
  // This prevents calculation errors and NaN results when data hasn't loaded yet
  if (!stockData.value.currentPrice || !stockData.value.previousClose) return 0

  // Calculate the difference between current price and previous close
  // 1. Subtract previous close from current price to get raw difference
  // 2. Use toFixed(2) to format to 2 decimal places (standard for dollar amounts)
  // 3. Parse result back to a number using parseFloat (toFixed returns a string)
  return parseFloat((stockData.value.currentPrice - stockData.value.previousClose).toFixed(2))
})

// priceChangePercent: Computed property that calculates the percentage change in stock price
const priceChangePercent = computed(() => {
  if (!stockData.value.previousClose) return 0
  return parseFloat(((priceChange.value / stockData.value.previousClose) * 100).toFixed(2))
})

// Watch for time range changes
watch(timeRange, handleTimeRangeChange)

//lifecycle
onMounted(async () => {
  // Fetch stock data
  await fetchStockData()

  // Add resize event listener
  window.addEventListener('resize', handleResize)
})

// Initialize charts lifecycle
onUnmounted(() => {
  // Clean up
  if (priceChartInstance) {
    priceChartInstance.dispose()
  }
  if (metricsChartInstance) {
    metricsChartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
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

  // Apply time range filter
  const now = new Date()
  let startDate = new Date()

  switch (timeRange.value) {
    case '1w':
      startDate.setDate(now.getDate() - 7)
      break
    case '1m':
      startDate.setMonth(now.getMonth() - 1)
      break
    case '3m':
      startDate.setMonth(now.getMonth() - 3)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }

  // Filter the data
  historicalData.value = rawHistoricalData.value.filter((item) => new Date(item.date) >= startDate)

  // Update charts
  initPriceChart()
}

// Filter data based on selected time range
const filterDataByTimeRange = (data) => {
  if (!data || !data.length) return []

  const now = new Date()
  let startDate = new Date()

  switch (timeRange.value) {
    case '1w':
      startDate.setDate(now.getDate() - 7)
      break
    case '1m':
      startDate.setMonth(now.getMonth() - 1)
      break
    case '3m':
      startDate.setMonth(now.getMonth() - 3)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
    case '5y':
      startDate.setFullYear(now.getFullYear() - 5)
      break
  }

  return data.filter((item) => new Date(item.date) >= startDate)
}

// Format large numbers with K, M, B, T suffixes
const formatLargeNumber = (num) => {
  if (!num) return '-'

  if (typeof num === 'string') {
    num = parseFloat(num.replace(/[^0-9.-]+/g, ''))
  }

  if (isNaN(num)) return '-'

  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(2) + 'T'
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(2) + 'K'
  }

  return num.toString()
}

// Utility functions
const goBack = () => {
  router.push('/')
}

const getColorClass = (value) => {
  if (value > 0) return 'price-up'
  if (value < 0) return 'price-down'
  return ''
}

const getNewsType = (index) => {
  const types = ['primary', 'success', 'warning', 'info']
  return types[index % types.length]
}

// Handle time range changes
const handleTimeRangeChange = () => {
  updateFilteredData()
}

const initPriceChart = () => {
  if (!priceChartContainer.value || !historicalData.value.length) return

  if (!priceChartInstance) {
    priceChartInstance = echarts.init(priceChartContainer.value)
  }

  const dates = historicalData.value.map((item) => item.date).reverse()
  const prices = historicalData.value.map((item) => parseFloat(item.close)).reverse()
  const volumes = historicalData.value
    .map((item) => {
      const vol =
        parseFloat(item.volume.replace(/[^\d.-]/g, '')) *
        (item.volume.includes('M') ? 1000000 : item.volume.includes('K') ? 1000 : 1)
      return [item.date, vol, item.change >= 0 ? 1 : -1]
    })
    .reverse()
  //ECharts option configuration
  const option = {
    title: {
      text: 'Price Trend', // Title text displayed at top of chart
      left: 'center', // Horizontal alignment of title
    },

    // Tooltip configuration - shows data details on hover
    tooltip: {
      trigger: 'axis', // Show tooltip when hovering over data points on axis
      axisPointer: {
        type: 'cross', // Shows crosshair style pointer for precise reading
      },
    },

    // displays chart series names
    legend: {
      data: ['Price', 'Volume'], // Names of data series to display in legend
      top: 30, // Position from top of chart
    },

    // defines layout areas
    grid: [
      {
        left: '5%', // Main chart area (price chart)
        right: '5%',
        top: '15%',
        height: '60%', // Takes 60% of available height
      },
      {
        left: '5%', // Secondary chart area (volume chart)
        right: '5%',
        top: '80%',
        height: '10%', // Takes 10% of available height
      },
    ],

    // X-axis configuration
    xAxis: [
      {
        type: 'category', // First x-axis for price chart
        data: dates, // Uses dates array for labels
        boundaryGap: false, // Start plotting from axis origin
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: 'dataMin', // Auto-scale to data minimum
        max: 'dataMax', // Auto-scale to data maximum
        axisPointer: { show: true },
      },
      {
        type: 'category', // Second x-axis for volume chart
        gridIndex: 1, // Associates with second grid area
        data: dates, // Uses same dates array
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false }, // Hide labels (they're already shown on main axis)
        min: 'dataMin',
        max: 'dataMax',
      },
    ],

    // Y-axis configuration
    yAxis: [
      {
        type: 'value', // First y-axis for price values
        scale: true, // Scale based on data range
        splitArea: { show: true },
        axisLabel: {
          formatter: '${value}', // Format y-axis labels with dollar sign
        },
      },
      {
        gridIndex: 1, // Second y-axis for volume values
        type: 'value',
        scale: true,
        axisLabel: { show: false }, // Hide labels for cleaner look
        axisLine: { show: false }, // Hide axis line
        axisTick: { show: false }, // Hide tick marks
        splitLine: { show: false }, // Hide grid lines
      },
    ],

    // Zoom control configuration
    dataZoom: [
      {
        type: 'inside', // Enable mouse wheel/pinch zoom
        xAxisIndex: [0, 1], // Apply to both x-axes
        start: 0, // Show entire data range initially
        end: 100,
      },
      {
        show: true, // Show the slider zoom control
        xAxisIndex: [0, 1], // Apply to both x-axes
        type: 'slider', // Slider style control
        bottom: '2%', // Position at bottom
        start: 0,
        end: 100,
      },
    ],

    // Data series configuration
    series: [
      {
        name: 'Price', // Price data series
        type: 'line', // Displayed as a line chart
        data: prices, // Uses prices array
        symbol: 'none', // Don't show symbols at data points
        lineStyle: {
          width: 2, // Line thickness
          color: '#5470c6', // Line color
        },
        areaStyle: {
          // Fill area under the line
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(84,112,198,0.5)', // Semi-transparent at top
            },
            {
              offset: 1,
              color: 'rgba(84,112,198,0.1)', // More transparent at bottom
            },
          ]),
        },
        markLine: {
          // Previous close reference line
          symbol: 'none', // No symbols on line ends
          data: [
            {
              yAxis: stockData.value.previousClose, // Value from stock data
              name: 'Previous Close',
              lineStyle: {
                color: '#999',
                type: 'dashed',
              },
              label: {
                formatter: 'Prev Close: ${value}', // Label text
                position: 'end', // Position at end of line
              },
            },
          ],
        },
      },
      {
        name: 'Volume', // Volume data series
        type: 'bar', // Displayed as a bar chart
        xAxisIndex: 1, // Use second x-axis
        yAxisIndex: 1, // Use second y-axis
        data: volumes, // Uses volumes array
        itemStyle: {
          color: (params) => {
            // Color bars based on price change (red for up, green for down)
            return params.data[2] > 0 ? '#ef5350' : '#26a69a'
          },
        },
      },
    ],
  }

  priceChartInstance.setOption(option)
}

// Responsive chart resizing handler
// This function ensures charts adjust correctly when window dimensions change
const handleResize = () => {
  if (priceChartInstance) {
    priceChartInstance.resize() // Resize the price/volume chart to fit current container
  }
  if (metricsChartInstance) {
    metricsChartInstance.resize() // Resize the metrics chart to fit current container
  }
}
</script>

<style scoped>
.stock-detail {
  padding: 20px;
}

.mt-4 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-price {
  font-size: 24px;
  font-weight: bold;
}

.price-up {
  color: #f56c6c;
}

.price-down {
  color: #67c23a;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.metrics-chart {
  width: 100%;
  height: 250px;
}

.company-info {
  margin-bottom: 20px;
}

/* Add these styles to make the layout more consistent */
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

.ratings-chart {
  height: 250px;
  margin-top: 10px;
}

.el-descriptions-item {
  height: 40px;
}
</style>

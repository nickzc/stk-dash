<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">
        <span>{{ stockName }} ({{ stockCode }})</span>
        <div class="price-info">
          <span
            class="current-price"
            :class="{ 'price-up': priceChange > 0, 'price-down': priceChange < 0 }"
          >
            ${{ currentPrice }}
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
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { VOLUME_MULTIPLIERS, VOLUME_SUFFIXES } from '@/utils/constants'

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
  CanvasRenderer,
])

const props = defineProps({
  stockName: {
    type: String,
    required: true,
  },
  stockCode: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  previousClose: {
    type: Number,
    default: 0,
  },
  historicalData: {
    type: Array,
    default: () => [],
  },
})

const priceChartContainer = ref(null)
let priceChartInstance = null

// priceChange: Computed property that calculates the absolute dollar change in stock price
// from the previous trading day's close price to the current price
const priceChange = computed(() => {
  // Return 0 if either current price or previous close is missing/invalid
  // This prevents calculation errors and NaN results when data hasn't loaded yet
  if (!props.currentPrice || !props.previousClose) return 0

  // Calculate the difference between current price and previous close
  // 1. Subtract previous close from current price to get raw difference
  // 2. Use toFixed(2) to format to 2 decimal places (standard for dollar amounts)
  // 3. Parse result back to a number using parseFloat (toFixed returns a string)
  return parseFloat((props.currentPrice - props.previousClose).toFixed(2))
})

// priceChangePercent: Computed property that calculates the percentage change in stock price
const priceChangePercent = computed(() => {
  if (!props.previousClose) return 0
  return parseFloat(((priceChange.value / props.previousClose) * 100).toFixed(2))
})

// Update chart theme based on current dark mode
const updateChartTheme = () => {
  if (!priceChartInstance) return

  const isDarkMode = document.documentElement.classList.contains('dark')

  // Update chart colors for dark/light mode
  priceChartInstance.setOption({
    backgroundColor: 'transparent',
    textStyle: {
      color: isDarkMode ? '#ddd' : '#333',
    },
    title: {
      textStyle: {
        color: isDarkMode ? '#ddd' : '#333',
      },
    },
    legend: {
      textStyle: {
        color: isDarkMode ? '#ddd' : '#333',
      },
    },
    xAxis: [
      {
        axisLine: {
          lineStyle: {
            color: isDarkMode ? '#666' : '#ccc',
          },
        },
        axisLabel: {
          color: isDarkMode ? '#ddd' : '#333',
        },
        splitLine: {
          lineStyle: {
            color: isDarkMode ? 'rgba(140, 140, 140, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
      {
        axisLine: {
          lineStyle: {
            color: isDarkMode ? '#666' : '#ccc',
          },
        },
      },
    ],
    yAxis: [
      {
        axisLine: {
          lineStyle: {
            color: isDarkMode ? '#666' : '#ccc',
          },
        },
        axisLabel: {
          color: isDarkMode ? '#ddd' : '#333',
        },
        splitLine: {
          lineStyle: {
            color: isDarkMode ? 'rgba(140, 140, 140, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
      {
        axisLine: {
          lineStyle: {
            color: isDarkMode ? '#666' : '#ccc',
          },
        },
      },
    ],
  })
}

const initPriceChart = () => {
  if (!priceChartContainer.value || !props.historicalData.length) return

  if (!priceChartInstance) {
    priceChartInstance = echarts.init(priceChartContainer.value)
  }

  const dates = props.historicalData.map((item) => item.date).reverse()
  const prices = props.historicalData.map((item) => parseFloat(item.close)).reverse()
  const volumes = props.historicalData
    .map((item) => {
      const vol =
        parseFloat(item.volume.replace(/[^\d.-]/g, '')) *
        (item.volume.includes(VOLUME_SUFFIXES.MILLION)
          ? VOLUME_MULTIPLIERS.MILLION
          : item.volume.includes(VOLUME_SUFFIXES.THOUSAND)
            ? VOLUME_MULTIPLIERS.THOUSAND
            : VOLUME_MULTIPLIERS.BASE)
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
              yAxis: props.previousClose, // Value from stock data
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
  updateChartTheme()
}

// Responsive chart resizing handler
// This function ensures charts adjust correctly when window dimensions change
const handleResize = () => {
  if (priceChartInstance) {
    priceChartInstance.resize() // Resize the price/volume chart to fit current container
  }
}

// Watch for changes in historical data to update chart
watch(
  () => props.historicalData,
  () => {
    initPriceChart()
  },
  { deep: true },
)

onMounted(() => {
  initPriceChart()

  // Add resize event listener
  window.addEventListener('resize', handleResize)

  // Listen for theme changes
  window.addEventListener('theme-changed', updateChartTheme)
})

onUnmounted(() => {
  // Clean up
  if (priceChartInstance) {
    priceChartInstance.dispose()
  }

  window.removeEventListener('resize', handleResize)
  window.removeEventListener('theme-changed', updateChartTheme)
})
</script>

<style scoped>
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

:global(html.dark) .price-up {
  color: #95d475;
}

:global(html.dark) .price-down {
  color: #ff7875;
}
</style>

<template>
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
      <el-descriptions-item label="Book Value">{{ stockData.bookValue }}</el-descriptions-item>
      <el-descriptions-item label="Dividend Yield"
        >{{ stockData.dividendYield }}%</el-descriptions-item
      >
      <el-descriptions-item label="Beta">{{ stockData.beta }}</el-descriptions-item>
      <el-descriptions-item label="Revenue">{{ stockData.revenue }}</el-descriptions-item>
      <el-descriptions-item label="Gross Profit">{{ stockData.grossProfit }}</el-descriptions-item>
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
</template>

<script setup>
// Props definition to receive stock data from parent
const props = defineProps({
  stockData: {
    type: Object,
    required: true,
    // Default values for financial metrics
    default: () => ({
      // Valuation metrics
      pe: 0, // Price-to-earnings ratio
      pegRatio: 0, // Price/earnings to growth ratio
      eps: 0, // Earnings per share
      bookValue: 0, // Book value per share
      dividendYield: 0, // Dividend yield as percentage with 2 decimal places

      // Market metrics
      beta: 0, // Stock volatility relative to market

      // Income statement highlights (formatted with K/M/B/T)
      revenue: '-', // Total revenue
      grossProfit: '-', // Gross profit

      // Profitability metrics (converted to percentages)
      profitMargin: 0, // Net profit margin percentage
      operatingMargin: 0, // Operating margin percentage
      returnOnEquity: 0, // Return on equity percentage
      returnOnAssets: 0, // Return on assets percentage
    }),
  },
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.same-height-card {
  height: 100%;
}
</style>

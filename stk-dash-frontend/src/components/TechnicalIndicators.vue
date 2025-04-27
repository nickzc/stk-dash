<template>
  <el-card shadow="hover" class="same-height-card">
    <template #header>
      <div class="card-header">
        <span>Technical Indicators</span>
      </div>
    </template>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="50-Day MA">${{ stockData.fiftyDayMA }}</el-descriptions-item>
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
</template>

<script setup>
// Props definition to receive stock data from parent
const props = defineProps({
  stockData: {
    type: Object,
    required: true,
    // Default values for technical indicators
    default: () => ({
      // Technical analysis indicators
      fiftyDayMA: 0, // 50 day moving average price
      twoHundredDayMA: 0, // 200 day moving average price

      // Analyst information
      analystTargetPrice: 0, // Average analyst price target

      // Financial reporting dates
      fiscalYearEnd: '-', // Date of fiscal year end
      latestQuarter: '-', // Date of most recent quarterly report
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

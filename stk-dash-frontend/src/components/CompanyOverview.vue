<template>
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
        <el-descriptions-item label="Market Cap">${{ stockData.marketCap }}</el-descriptions-item>
        <el-descriptions-item label="52-Week High">${{ stockData.yearHigh }}</el-descriptions-item>
        <el-descriptions-item label="52-Week Low">${{ stockData.yearLow }}</el-descriptions-item>
        <el-descriptions-item label="Avg. Volume">{{
          stockData.averageVolume
        }}</el-descriptions-item>
        <el-descriptions-item label="Website">
          <a :href="stockData.website" target="_blank">{{ stockData.website }}</a>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>

<script setup>
// Props definition to receive stock data from parent
const props = defineProps({
  stockData: {
    type: Object,
    required: true,
    // Default values for each expected property in the stockData object
    default: () => ({
      // Company classification information
      industry: '-', // Specific industry category
      sector: '-', // Broader market sector

      // Market information
      exchange: '-', // Stock exchange where traded
      currency: '-', // Trading currency (e.g. USD)

      // Market capitalization (formatted with K/M/B/T)
      marketCap: '-',

      // 52-week trading range
      yearHigh: 0, // Highest price in past 52 weeks
      yearLow: 0, // Lowest price in past 52 weeks

      // Average trading volume
      averageVolume: '-',

      // Company website URL
      website: '#',
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

.company-info {
  margin-bottom: 20px;
}
</style>

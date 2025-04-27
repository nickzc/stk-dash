<template>
  <div class="stock-list-container">
    <div class="header-container">
      <h1 class="title">Stock Dashboard</h1>
      <ThemeManager />
    </div>

    <el-card class="stock-list-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @row-click="handleRowClick"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="symbol" label="Symbol" min-width="100" sortable />
        <el-table-column prop="name" label="Company Name" min-width="200" sortable />
        <el-table-column label="Price" min-width="120" sortable>
          <template #default="scope">
            <span>${{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="change" label="Change" min-width="120" sortable>
          <template #default="scope">
            <span :class="{ positive: scope.row.change > 0, negative: scope.row.change < 0 }">
              {{ scope.row.change > 0 ? '+' : '' }}{{ scope.row.change }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="changePercent" label="Change %" min-width="120" sortable>
          <template #default="scope">
            <span
              :class="{
                positive: scope.row.changePercent > 0,
                negative: scope.row.changePercent < 0,
              }"
            >
              {{ scope.row.changePercent > 0 ? '+' : '' }}{{ scope.row.changePercent.toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="volume" label="Volume" min-width="120" sortable>
          <template #default="scope">
            {{ formatVolume(scope.row.volume) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Actions" width="160">
          <template #default="scope">
            <div class="action-buttons">
              <el-button link type="primary" size="small" @click.stop="handleClick(scope.row)">
                Details
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStockList } from '../utils/api'
import ThemeManager from '../components/ThemeToggle.vue'

import { formatVolume } from '@/utils/formatters'
const router = useRouter()
const tableData = ref([])
const loading = ref(false)

const handleClick = (row) => {
  router.push({
    name: 'StockDetailView',
    params: { id: row.symbol },
  })
}

const handleRowClick = (row) => {
  router.push({
    name: 'StockDetailView',
    params: { id: row.symbol },
  })
}

const tableRowClassName = () => {
  return 'clickable-row'
}

// Fetch stock list from API
const fetchStockList = async () => {
  try {
    loading.value = true
    const response = await getStockList()

    if (response && response.data) {
      tableData.value = response.data
    } else {
      console.error('Invalid response format:', response)
      tableData.value = []
    }
  } catch (error) {
    console.error('Failed to fetch stock list:', error)
    tableData.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStockList()
})

onUnmounted(() => {})
</script>

//scoped styles
<style scoped>
.stock-list-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background-color: var(--color-background);
  transition: background-color 0.3s;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 0;
  color: var(--color-text);
  font-family: Arial, sans-serif;
}

.stock-list-card {
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
}

.positive {
  color: #67c23a;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

.negative {
  color: #f56c6c;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: Arial, sans-serif;
}

.clickable-row:hover {
  background-color: #f5f7fa;
}

.action-buttons {
  display: flex;
  align-items: center;
  font-family: Arial, sans-serif;
}

/* Dark mode specific styles */
:global(html.dark) .stock-list-container {
  background-color: var(--color-background);
}

:global(html.dark) .stock-list-card {
  background-color: var(--color-background-soft);
}

:global(html.dark) .el-card {
  border-color: var(--color-border);
}

:global(html.dark) .el-table {
  background-color: var(--color-background-soft);
}

:global(html.dark) .el-table tr,
:global(html.dark) .el-table th {
  background-color: var(--color-background-soft);
}

:global(html.dark) .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: var(--color-background-mute);
}
:global(html.dark) .title {
  color: white !important;
}

:global(html.dark) .clickable-row:hover {
  background-color: #363637;
}

:global(html.dark) .positive {
  color: #95d475;
}

:global(html.dark) .negative {
  color: #ff7875;
}
</style>

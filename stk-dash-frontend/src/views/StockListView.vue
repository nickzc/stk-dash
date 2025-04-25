<template>
  <div class="stock-list-container">
    <h1 class="title">Stock Dashboard</h1>

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
        <el-table-column label="Change" min-width="120" sortable>
          <template #default="scope">
            <span :class="{ positive: scope.row.change > 0, negative: scope.row.change < 0 }">
              {{ scope.row.change > 0 ? '+' : '' }}{{ scope.row.change }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Change %" min-width="120" sortable>
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
              <el-button
                link
                type="warning"
                size="small"
                @click.stop="toggleFavorite(scope.row)"
                class="favorite-btn"
              >
                <el-icon :size="18" :color="isFavorite(scope.row.symbol) ? '#E6A23C' : '#909399'">
                  <component :is="isFavorite(scope.row.symbol) ? 'StarFilled' : 'Star'" />
                </el-icon>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStockList } from '../utils/api'

const router = useRouter()
const tableData = ref([])
const loading = ref(false)
const favorites = ref([])

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

const formatVolume = (volume) => {
  if (volume >= 1000000) {
    return (volume / 1000000).toFixed(2) + 'M'
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + 'K'
  }
  return volume
}

const isFavorite = (symbol) => {
  return favorites.value.includes(symbol)
}

const toggleFavorite = (row) => {
  const index = favorites.value.indexOf(row.symbol)
  if (index === -1) {
    favorites.value.push(row.symbol)
    // Optionally save to localStorage
    localStorage.setItem('favoriteStocks', JSON.stringify(favorites.value))
  } else {
    favorites.value.splice(index, 1)
    // Optionally save to localStorage
    localStorage.setItem('favoriteStocks', JSON.stringify(favorites.value))
  }
}

onMounted(() => {
  fetchStockList()
  // Load favorites from localStorage if available
  const storedFavorites = localStorage.getItem('favoriteStocks')
  if (storedFavorites) {
    favorites.value = JSON.parse(storedFavorites)
  }
})

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
</script>

<style scoped>
.stock-list-container {
  padding: 20px;
}

.title {
  margin-bottom: 20px;
  color: #303133;
}

.stock-list-card {
  margin-bottom: 20px;
}

.positive {
  color: #67c23a;
  font-weight: bold;
}

.negative {
  color: #f56c6c;
  font-weight: bold;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.3s;
}

.clickable-row:hover {
  background-color: #f5f7fa;
}

.action-buttons {
  display: flex;
  align-items: center;
}

.favorite-btn {
  margin-left: 8px;
  padding: 4px;
}
</style>

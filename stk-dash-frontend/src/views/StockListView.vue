<template>
  <div class="stock-list-container">
    <div class="header-container">
      <h1 class="title">Stock Dashboard</h1>
      <div class="theme-toggle">
        <el-tooltip content="Light Mode" placement="top" :hide-after="300">
          <el-button
            class="theme-button"
            :class="{ active: themeMode === 'light' }"
            @click="setThemeMode('light')"
          >
            <el-icon><Sunny /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="System Preference" placement="top" :hide-after="300">
          <el-button
            class="theme-button"
            :class="{ active: themeMode === 'system' }"
            @click="setThemeMode('system')"
          >
            <el-icon><Monitor /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="Dark Mode" placement="top" :hide-after="300">
          <el-button
            class="theme-button"
            :class="{ active: themeMode === 'dark' }"
            @click="setThemeMode('dark')"
          >
            <el-icon><Moon /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStockList } from '../utils/api'

const router = useRouter()
const tableData = ref([])
const loading = ref(false)
const favorites = ref([])
const themeMode = ref('system') // 'light', 'dark', or 'system'
let mediaQueryList = null

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

// Apply theme based on current theme mode
const applyTheme = () => {
  if (themeMode.value === 'system') {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    toggleDarkMode(prefersDark)
  } else {
    // Use explicit user choice
    toggleDarkMode(themeMode.value === 'dark')
  }

  // Save user preference
  localStorage.setItem('themeMode', themeMode.value)
}

// Handle system theme preference changes
const handleSystemThemeChange = (e) => {
  if (themeMode.value === 'system') {
    toggleDarkMode(e.matches)
  }
}

// Set the theme mode and apply it
const setThemeMode = (mode) => {
  themeMode.value = mode
  applyTheme()
}

// Toggle dark mode on/off
const toggleDarkMode = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
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

  // Load favorites from localStorage if available
  const storedFavorites = localStorage.getItem('favoriteStocks')
  if (storedFavorites) {
    favorites.value = JSON.parse(storedFavorites)
  }

  // Set up theme based on saved preference or system default
  const savedThemeMode = localStorage.getItem('themeMode')
  if (savedThemeMode) {
    themeMode.value = savedThemeMode
  }

  // Set up media query for system preference detection
  mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQueryList.addEventListener('change', handleSystemThemeChange)

  // Apply the current theme
  applyTheme()
})

onUnmounted(() => {
  // Clean up media query listener
  if (mediaQueryList) {
    mediaQueryList.removeEventListener('change', handleSystemThemeChange)
  }
})
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

.theme-toggle {
  display: flex;
  gap: 5px;
  border-radius: 4px;
  overflow: hidden;
}

.theme-button {
  border-radius: 4px;
  padding: 8px 12px;
  color: var(--el-text-color-primary, #303133);
}

.theme-button.active {
  background-color: var(--el-color-primary, #409eff);
  color: white;
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

.favorite-btn {
  margin-left: 8px;
  padding: 4px;
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

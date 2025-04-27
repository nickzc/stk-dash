<template>
  <el-card shadow="hover">
    <template #header>
      <div class="card-header">
        <span>Historical Data</span>
        <el-radio-group v-model="timeRangeLocal" size="small" @change="handleTimeRangeChange">
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
</template>

<script setup>
import { ref, watch } from 'vue'

// Define props for component
const props = defineProps({
  historicalData: {
    type: Array,
    default: () => [],
  },
  rawHistoricalData: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: '1m',
  },
})

// Define emits for two-way binding and events
const emit = defineEmits(['update:modelValue', 'time-range-change'])

// Set up local state for time range that syncs with parent via v-model
const timeRangeLocal = ref(props.modelValue)

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    timeRangeLocal.value = newValue
  },
)

// Watch for local changes to update the parent
watch(timeRangeLocal, (newValue) => {
  emit('update:modelValue', newValue)
})

// Utility function to get CSS class based on value
// Determines color styling based on positive/negative price change
const getColorClass = (value) => {
  if (value > 0) return 'price-up' // Positive change
  if (value < 0) return 'price-down' // Negative change
  return '' // No change
}

// Handle time range changes
// Emits event to notify parent component when time range selection changes
const handleTimeRangeChange = () => {
  emit('time-range-change')
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

/* Price change color indicators */
.price-up {
  color: #f56c6c; /* Red for price increase in light mode */
}

.price-down {
  color: #67c23a; /* Green for price decrease in light mode */
}

/* Dark mode color adjustments */
:global(html.dark) .price-up {
  color: #95d475; /* Green for price increase in dark mode */
}

:global(html.dark) .price-down {
  color: #ff7875; /* Red for price decrease in dark mode */
}
</style>

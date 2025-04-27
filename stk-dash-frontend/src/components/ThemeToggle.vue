<template>
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
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useThemeManager } from '@/utils/ThemeManager'

// Use the centralized theme manager
const { themeMode, applyTheme, setupTheme, cleanupTheme, saveThemePreference } = useThemeManager()

// Set the theme mode using the theme manager
const setThemeMode = (mode) => {
  saveThemePreference(mode)
}

onMounted(() => {
  // Initialize theme manager
  setupTheme()
})

onUnmounted(() => {
  // Clean up any event listeners
  cleanupTheme()
})
</script>

<style scoped>
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
</style>

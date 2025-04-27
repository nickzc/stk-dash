import { ref, onMounted, onUnmounted } from 'vue'

export function useThemeManager() {
  // 'light', 'dark', or 'system'
  const themeMode = ref('system')
  let mediaQueryList = null

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
  }

  const handleSystemThemeChange = (e) => {
    if (themeMode.value === 'system') {
      toggleDarkMode(e.matches)
    }
  }

  const toggleDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Dispatch an event so components can respond to theme changes
    window.dispatchEvent(new CustomEvent('theme-changed'))
  }

  const setupTheme = () => {
    // Set up theme based on saved preference
    const savedThemeMode = localStorage.getItem('themeMode')
    if (savedThemeMode) {
      themeMode.value = savedThemeMode
    }

    // Set up media query for system preference detection
    mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQueryList.addEventListener('change', handleSystemThemeChange)

    // Apply the current theme
    applyTheme()
  }

  const cleanupTheme = () => {
    // Clean up media query listener
    if (mediaQueryList) {
      mediaQueryList.removeEventListener('change', handleSystemThemeChange)
    }
  }

  // Save theme preference to localStorage
  const saveThemePreference = (mode) => {
    themeMode.value = mode
    localStorage.setItem('themeMode', mode)
    applyTheme()
  }

  return {
    themeMode,
    applyTheme,
    toggleDarkMode,
    setupTheme,
    cleanupTheme,
    saveThemePreference,
  }
}

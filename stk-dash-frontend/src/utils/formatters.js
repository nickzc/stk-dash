/**
 * Formats large numbers with K, M, B, T suffixes for better readability
 * @param {number|string} num - The number to format
 * @returns {string} Formatted number with appropriate suffix
 */
export const formatLargeNumber = (num) => {
  if (!num) return '-'

  if (typeof num === 'string') {
    num = parseFloat(num.replace(/[^0-9.-]+/g, ''))
  }

  if (isNaN(num)) return '-'

  // Store the sign separately
  const isNegative = num < 0
  const absNum = Math.abs(num)
  let result

  if (absNum >= 1000000000000) {
    result = (absNum / 1000000000000).toFixed(2) + 'T'
  } else if (absNum >= 1000000000) {
    result = (absNum / 1000000000).toFixed(2) + 'B'
  } else if (absNum >= 1000000) {
    result = (absNum / 1000000).toFixed(2) + 'M'
  } else if (absNum >= 1000) {
    result = (absNum / 1000).toFixed(2) + 'K'
  } else {
    result = absNum.toString()
  }

  // Apply the negative sign if necessary
  return isNegative ? '-' + result : result
}

/**
 * Calculates a date from the current date based on a specified time range
 * @param {string} timeRange - Time range specifier ('1w', '1m', '3m', '1y')
 * @returns {Date} Calculated start date
 */
export const calculateDateRange = (timeRange) => {
  const now = new Date()
  let startDate = new Date()

  switch (timeRange) {
    case '1w':
      startDate.setDate(now.getDate() - 7)
      break
    case '1m':
      startDate.setMonth(now.getMonth() - 1)
      break
    case '3m':
      startDate.setMonth(now.getMonth() - 3)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      startDate.setMonth(now.getMonth() - 1) // Default to 1 month
  }

  return startDate
}

/**
 * Formats volume numbers with K, M suffixes for better readability
 * @param {number|string} volume - The volume to format
 * @returns {string} Formatted volume with appropriate suffix
 */
export const formatVolume = (volume) => {
  if (!volume && volume !== 0) return '-'

  if (typeof volume === 'string') {
    volume = parseFloat(volume.replace(/[^0-9.-]+/g, ''))
  }

  if (isNaN(volume)) return '-'

  if (volume >= 1000000) {
    return (volume / 1000000).toFixed(2) + 'M'
  } else if (volume >= 1000) {
    return (volume / 1000).toFixed(2) + 'K'
  }

  return volume.toString()
}

import { formatLargeNumber, calculateDateRange, formatVolume } from './formatters.js'

describe('formatLargeNumber', () => {
  test('formats negative numbers correctly', () => {
    expect(formatLargeNumber(-1000)).toBe('-1.00K')
    expect(formatLargeNumber(-1000000)).toBe('-1.00M')
  })

  test('handles decimal input values', () => {
    expect(formatLargeNumber(1234.56)).toBe('1.23K')
    expect(formatLargeNumber(1234567.89)).toBe('1.23M')
  })

  test('formats numbers with suffixes', () => {
    expect(formatLargeNumber(1500)).toBe('1.50K')
    expect(formatLargeNumber(1500000)).toBe('1.50M')
    expect(formatLargeNumber(1500000000)).toBe('1.50B')
    expect(formatLargeNumber(1500000000000)).toBe('1.50T')
  })
})

describe('calculateDateRange', () => {
  beforeEach(() => {
    // Mock Date to ensure consistent test results
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-04-27'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('calculates common time ranges correctly', () => {
    // 1 week
    let result = calculateDateRange('1w')
    let expected = new Date('2025-04-20')
    expect(result.toDateString()).toBe(expected.toDateString())

    // 1 month
    result = calculateDateRange('1m')
    expected = new Date('2025-03-27')
    expect(result.toDateString()).toBe(expected.toDateString())

    // Default case (invalid input)
    result = calculateDateRange('invalid')
    expected = new Date('2025-03-27') // Default to 1 month
    expect(result.toDateString()).toBe(expected.toDateString())
  })
})

describe('formatVolume', () => {
  test('formats volume with K suffix for thousands', () => {
    expect(formatVolume(1500)).toBe('1.50K')
    expect(formatVolume(5678)).toBe('5.68K')
  })

  test('formats volume with M suffix for millions', () => {
    expect(formatVolume(1500000)).toBe('1.50M')
    expect(formatVolume(7890000)).toBe('7.89M')
  })

  test('returns original number if less than 1000', () => {
    expect(formatVolume(500)).toBe('500')
    expect(formatVolume(45)).toBe('45')
  })

  test('handles string inputs correctly', () => {
    expect(formatVolume('2500')).toBe('2.50K')
    expect(formatVolume('3000000')).toBe('3.00M')
    expect(formatVolume('250')).toBe('250')
  })

  test('handles formatted string inputs', () => {
    expect(formatVolume('2,500')).toBe('2.50K')
    expect(formatVolume('3,000,000')).toBe('3.00M')
  })

  test('handles edge cases', () => {
    expect(formatVolume(0)).toBe('0')
    expect(formatVolume(null)).toBe('-')
    expect(formatVolume(undefined)).toBe('-')
    expect(formatVolume('invalid')).toBe('-')
  })
})

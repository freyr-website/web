import type { DailyWeather } from '../types/weather'

export const calculateRainfallTotal = (days: DailyWeather[]) => days.reduce((total, day) => total + day.rain, 0)
export const calculateAverageRainfall = (days: DailyWeather[]) => days.length ? calculateRainfallTotal(days) / days.length : 0
export const calculateWetDays = (days: DailyWeather[]) => days.filter((day) => day.rain >= 1).length
export const calculateDryDays = (days: DailyWeather[]) => days.filter((day) => day.rain < 1).length

export const calculateLongestStreak = (days: DailyWeather[], wet: boolean) => {
  let current = 0
  let longest = 0
  days.forEach((day) => {
    const matches = wet ? day.rain >= 1 : day.rain < 1
    current = matches ? current + 1 : 0
    longest = Math.max(longest, current)
  })
  return longest
}

export const calculateRainfallTrend = (days: DailyWeather[]) => {
  const midpoint = Math.max(1, Math.floor(days.length / 2))
  const first = calculateAverageRainfall(days.slice(0, midpoint))
  const second = calculateAverageRainfall(days.slice(midpoint))
  if (second > first * 1.2) return 'Tăng'
  if (second < first * 0.8) return 'Giảm'
  return 'Ổn định'
}

export const getRainfallIndex = (days: DailyWeather[]) => Math.min(100, Math.round((calculateAverageRainfall(days) / 25) * 100))
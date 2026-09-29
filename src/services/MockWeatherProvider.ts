import { mockWeather } from '../data/mockWeather'
import type { Location, WeatherData, WeatherQuery } from '../types/weather'
import type { WeatherProvider } from './WeatherProvider'
export class MockWeatherProvider implements WeatherProvider {
  readonly name = 'mock' as const
  async getWeather(location: Location, _query: WeatherQuery): Promise<WeatherData> {
    const offset = Math.round(Math.abs(location.latitude * 11 + location.longitude * 7)) % 9 - 4
    const history = mockWeather.history.map((day, index) => ({ ...day, rain: Math.max(0, day.rain + offset + (index % 3 === 0 ? 1 : 0)), temperature: day.temperature + offset / 3, humidity: Math.max(45, Math.min(96, day.humidity + offset)) }))
    const forecast = mockWeather.forecast.map((day) => ({ ...day, rain: Math.max(0, day.rain + offset), temperature: day.temperature + offset / 3, humidity: Math.max(45, Math.min(96, day.humidity + offset)) }))
    return { ...mockWeather, location: { ...location, updatedAt: new Date().toLocaleString('vi-VN') }, current: { ...mockWeather.current, temperature: mockWeather.current.temperature + offset / 3, rain: Math.max(0, mockWeather.current.rain + offset), humidity: Math.max(45, Math.min(96, mockWeather.current.humidity + offset)) }, history, forecast, fetchedAt: new Date().toISOString() }
  }
}
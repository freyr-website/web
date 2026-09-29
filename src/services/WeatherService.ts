import { MockWeatherProvider } from './MockWeatherProvider'
import { OpenMeteoProvider } from './OpenMeteoProvider'
import type { Location, WeatherData, WeatherQuery } from '../types/weather'
import { WeatherCache } from './WeatherCache'
import type { WeatherProvider } from './WeatherProvider'

export class WeatherService {
  private readonly cache = new WeatherCache()
  private readonly provider: WeatherProvider = import.meta.env.VITE_WEATHER_PROVIDER === 'mock' ? new MockWeatherProvider() : new OpenMeteoProvider()
  readonly providerName = this.provider.name

  async getWeather(location: Location): Promise<WeatherData> {
    const endDate = new Date().toISOString().slice(0, 10)
    const query: WeatherQuery = { latitude: location.latitude, longitude: location.longitude, startDate: endDate, endDate }
    const cached = this.cache.get(query, this.provider.name)
    if (cached) return cached
    const data = await this.provider.getWeather(location, query)
    this.cache.set(query, this.provider.name, data)
    return data
  }
}

export const weatherService = new WeatherService()

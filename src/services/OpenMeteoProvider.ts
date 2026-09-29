import type { DailyWeather, Location, WeatherData, WeatherQuery } from '../types/weather'
import type { WeatherProvider } from './WeatherProvider'
type OpenMeteoResponse = { current: { temperature_2m: number; relative_humidity_2m: number; precipitation: number; wind_speed_10m: number }; daily: { time: string[]; precipitation_sum: number[]; temperature_2m_mean: number[]; relative_humidity_2m_mean: number[]; precipitation_probability_max: number[] } }
const weatherLabel = (rain: number, probability: number) => rain >= 10 || probability >= 70 ? 'Mưa rào' : rain > 0 ? 'Có mưa nhẹ' : 'Trời quang mây'
export class OpenMeteoProvider implements WeatherProvider {
  readonly name = 'open-meteo' as const
  async getWeather(location: Location, query: WeatherQuery): Promise<WeatherData> {
    const params = new URLSearchParams({ latitude: String(query.latitude), longitude: String(query.longitude), timezone: 'auto', past_days: '30', forecast_days: '7', current: 'temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_10m', daily: 'precipitation_sum,temperature_2m_mean,relative_humidity_2m_mean,precipitation_probability_max' })
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
    if (!response.ok) throw new Error(`Open-Meteo request failed: ${response.status}`)
    const payload = await response.json() as OpenMeteoResponse
    const daily: DailyWeather[] = payload.daily.time.map((date, index) => ({ date, label: `${date.slice(8, 10)}/${date.slice(5, 7)}`, rain: payload.daily.precipitation_sum[index] ?? 0, temperature: payload.daily.temperature_2m_mean[index] ?? payload.current.temperature_2m, humidity: payload.daily.relative_humidity_2m_mean[index] ?? payload.current.relative_humidity_2m, probability: payload.daily.precipitation_probability_max[index] ?? 0 }))
    const today = new Date().toISOString().slice(0, 10)
    const currentProbability = daily.find((day) => day.date === today)?.probability ?? 0
    return { location: { ...location, updatedAt: new Date().toLocaleString('vi-VN') }, current: { temperature: payload.current.temperature_2m, humidity: payload.current.relative_humidity_2m, rain: payload.current.precipitation, probability: currentProbability, wind: payload.current.wind_speed_10m, condition: weatherLabel(payload.current.precipitation, currentProbability) }, history: daily.filter((day) => day.date <= today).slice(-30), forecast: daily.filter((day) => day.date > today).slice(0, 7), isDemo: false, provider: this.name, fetchedAt: new Date().toISOString() }
  }
}
import type { CropType, WeatherData } from '../types/weather'
import { buildWeatherMetrics } from '../utils/weatherMetrics'

export type AgriculturalInsight = {
  summary: string
  risks: { water: 'low' | 'medium' | 'high'; flood: 'low' | 'medium' | 'high'; heat: 'low' | 'medium' | 'high'; disease: 'low' | 'medium' | 'high' }
  recommendations: { title: string; description: string; priority: 'low' | 'medium' | 'high' }[]
  reasoning: string
  confidence: 'low' | 'medium' | 'high'
}

export class GeminiAgriculturalAdvisor {
  async explain(data: WeatherData, crop: CropType): Promise<AgriculturalInsight> {
    const metrics = buildWeatherMetrics(data)
    const requestBody = {
      location: data.location.name,
      crop,
      rainfall: { '24h': metrics.rainfall_24h, '3d': metrics.rainfall_3d, '7d': metrics.rainfall_7d, '30d': metrics.rainfall_30d },
      temperature: { current: data.current.temperature, average_7d: metrics.average_temperature, max_7d: Math.max(...data.history.slice(-7).map((day) => day.temperature), data.current.temperature) },
      humidity: { current: data.current.humidity, average_7d: metrics.average_humidity },
      dry_days: metrics.dry_days,
      wet_days: metrics.wet_days,
      forecast_rainfall_3d: metrics.forecast_rainfall_3d,
    }
    const response = await fetch('/api/agriculture/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) })
    if (!response.ok) throw new Error(`Gemini advisor request failed: ${response.status}`)
    return await response.json() as AgriculturalInsight
  }
}

export const geminiAgriculturalAdvisor = new GeminiAgriculturalAdvisor()
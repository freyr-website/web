import type { WeatherData, WeatherQuery } from '../types/weather'
type CacheEntry = { data: WeatherData; fetchedAt: string; expiresAt: string }
const prefix = 'freyr.weather.'
export class WeatherCache {
  private readonly ttlMs: number
  constructor(ttlMs = 15 * 60 * 1000) { this.ttlMs = ttlMs }
  private key(query: WeatherQuery, provider: string) { return `${prefix}${query.latitude}:${query.longitude}:${query.startDate}:${query.endDate}:${provider}` }
  get(query: WeatherQuery, provider: string) { const raw = localStorage.getItem(this.key(query, provider)); if (!raw) return undefined; try { const entry = JSON.parse(raw) as CacheEntry; return new Date(entry.expiresAt).getTime() > Date.now() ? entry.data : undefined } catch { return undefined } }
  set(query: WeatherQuery, provider: string, data: WeatherData) { const fetchedAt = new Date().toISOString(); const expiresAt = new Date(Date.now() + this.ttlMs).toISOString(); localStorage.setItem(this.key(query, provider), JSON.stringify({ data, fetchedAt, expiresAt } satisfies CacheEntry)) }
}
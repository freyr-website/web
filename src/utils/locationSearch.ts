import locations from '../data/vietnam-locations.json'
import type { Location } from '../types/weather'

export type LocationRecord = Omit<Location, 'updatedAt'>
const removeMarks = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
export const locationRecords = locations as LocationRecord[]
export const findLocation = (id: string) => locationRecords.find((item) => item.id === id)
export const searchLocations = (query: string) => { const normalized = removeMarks(query); if (!normalized) return locationRecords; return locationRecords.filter((item) => removeMarks(`${item.name} ${item.province} ${item.region} ${item.id}`).includes(normalized)) }
const aliases: Record<string, string> = { 'tp hcm': 'ho chi minh', 'tphcm': 'ho chi minh', 'hcm': 'ho chi minh', 'sg': 'ho chi minh' }
export const searchLocationsWithAliases = (query: string) => searchLocations(aliases[removeMarks(query)] ?? query)
export const toWeatherLocation = (location: LocationRecord): Location => ({ ...location, updatedAt: '' })
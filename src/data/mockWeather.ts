import type { WeatherData } from '../types/weather'

const rain = [8, 0, 12, 25, 18, 0, 6, 32, 14, 0, 4, 11, 0, 22, 9, 0, 17, 28, 6, 0, 13, 8, 2, 19, 0, 5, 16, 34, 12, 7]
const temperatures = [28, 29, 28, 27, 27, 28, 29, 28, 27, 28, 29, 30, 30, 29, 28, 28, 29, 27, 28, 29, 30, 30, 29, 28, 28, 29, 30, 29, 28, 28]

export const mockWeather: WeatherData = {
  location: { id: 'dak-lak', name: 'Đắk Lắk', province: 'Đắk Lắk', region: 'Tây Nguyên', latitude: 12.71, longitude: 108.2378, updatedAt: '23/09/2026, 08:42' },
  current: { temperature: 28, humidity: 82, rain: 4, probability: 68, wind: 9, condition: 'Mưa rào nhẹ' },
  history: rain.map((value, index) => ({
    date: `2026-09-${String(index + 1).padStart(2, '0')}`,
    label: `${String(index + 1).padStart(2, '0')}/09`,
    rain: value,
    temperature: temperatures[index],
    humidity: Math.min(93, 68 + value + (index % 4) * 3),
    probability: value > 0 ? Math.min(92, 42 + value) : 18,
  })),
  forecast: [12, 18, 5, 2, 0].map((value, index) => ({ date: `2026-09-${String(index + 31).padStart(2, '0')}`, label: `Ngày ${index + 1}`, rain: value, temperature: 28 + (index % 2), humidity: 78 + index * 2, probability: value ? 60 + index * 4 : 24 })),
  isDemo: true,
  provider: 'mock',
  fetchedAt: '2026-09-23T08:42:00.000Z',
}
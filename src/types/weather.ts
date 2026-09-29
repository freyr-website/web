export type CropType = 'Lúa' | 'Ngô' | 'Cà phê' | 'Hồ tiêu' | 'Rau màu' | 'Cây ăn quả' | 'Cây công nghiệp' | 'Cây trồng khác'

export type DailyWeather = {
  date: string
  label: string
  rain: number
  temperature: number
  humidity: number
  probability: number
}

export type Location = {
  id: string
  name: string
  province: string
  region: string
  latitude: number
  longitude: number
  updatedAt: string
}

export type WeatherProviderName = 'open-meteo' | 'mock'

export type WeatherQuery = {
  latitude: number
  longitude: number
  startDate: string
  endDate: string
}

export type WeatherData = {
  location: Location
  current: {
    temperature: number
    humidity: number
    rain: number
    probability: number
    wind: number
    condition: string
  }
  history: DailyWeather[]
  forecast: DailyWeather[]
  isDemo: boolean
  provider: WeatherProviderName
  fetchedAt: string
}

export type Risk = {
  level: 'info' | 'normal' | 'watch' | 'high' | 'very-high'
  title: string
  detail: string
  icon: string
}
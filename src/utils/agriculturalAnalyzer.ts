import type { Risk, WeatherData } from '../types/weather'
import { calculateDryDays, calculateLongestStreak, calculateRainfallTotal, calculateWetDays } from './rainfallAnalyzer'

export const calculateWaterRisk = (data: WeatherData): Risk => {
  const recent = data.history.slice(-7)
  const dryDays = calculateLongestStreak(recent, false)
  if (calculateRainfallTotal(recent) < 35 || dryDays >= 4) return { level: 'watch', title: 'Nguy cơ thiếu nước', detail: `7 ngày qua có ${calculateRainfallTotal(recent)} mm mưa và ${dryDays} ngày khô liên tiếp. Cần kiểm tra ẩm đất trước khi tưới bổ sung.`, icon: 'droplets' }
  return { level: 'normal', title: 'Nguồn nước tương đối ổn', detail: 'Lượng mưa gần đây đang hỗ trợ nhu cầu nước, nhưng vẫn cần đối chiếu với thực tế ruộng.', icon: 'droplets' }
}

export const calculateFloodRisk = (data: WeatherData): Risk => {
  const total = calculateRainfallTotal(data.history.slice(-3))
  const forecast = calculateRainfallTotal(data.forecast.slice(0, 2))
  if (total >= 55 && forecast > 0) return { level: 'high', title: 'Nguy cơ úng nước', detail: `3 ngày gần đây có ${total} mm mưa, 48 giờ tới dự báo thêm ${forecast} mm. Kiểm tra vùng trũng và lối thoát nước.`, icon: 'waves' }
  return { level: 'normal', title: 'Nguy cơ ngập ở mức thấp', detail: 'Chưa thấy tín hiệu mưa dồn dập trong ngắn hạn theo dữ liệu hiện có.', icon: 'waves' }
}

export const calculateHeatStress = (data: WeatherData): Risk => {
  const hotDays = data.history.slice(-7).filter((day) => day.temperature >= 32).length
  if (data.current.temperature >= 32 || hotDays >= 3) return { level: 'watch', title: 'Theo dõi stress nhiệt', detail: `${hotDays} ngày gần đây có nhiệt độ cao. Nên kiểm tra lá, tán cây và ẩm đất vào buổi trưa.`, icon: 'sun' }
  return { level: 'normal', title: 'Nhiệt độ trong ngưỡng theo dõi', detail: 'Nhiệt độ hiện tại chưa cho thấy tín hiệu stress nhiệt rõ rệt.', icon: 'sun' }
}

export const calculateDiseaseRisk = (data: WeatherData): Risk => {
  const recent = data.history.slice(-7)
  const wetDays = calculateWetDays(recent)
  if (data.current.humidity >= 80 && wetDays >= 4) return { level: 'watch', title: 'Điều kiện thuận lợi cho bệnh', detail: 'Độ ẩm cao kết hợp nhiều ngày có mưa có thể tạo điều kiện cho một số bệnh nấm hoặc vi khuẩn. Cần kiểm tra thực tế trước khi xử lý.', icon: 'sprout' }
  return { level: 'normal', title: 'Áp lực bệnh chưa nổi bật', detail: 'Dữ liệu thời tiết hiện có chưa cho thấy tổ hợp rủi ro mạnh; vẫn nên kiểm tra ruộng định kỳ.', icon: 'sprout' }
}

export const buildHealthScore = (data: WeatherData) => {
  const recent = data.history.slice(-7)
  const water = Math.max(40, Math.min(95, 100 - calculateDryDays(recent) * 8))
  const rainfall = Math.max(35, Math.min(92, 100 - Math.abs(calculateRainfallTotal(recent) - 70)))
  const temperature = data.current.temperature >= 32 ? 55 : 86
  const humidity = data.current.humidity > 90 ? 62 : 82
  const extreme = calculateRainfallTotal(data.history.slice(-3)) > 70 ? 52 : 88
  const values = { water, rainfall, temperature, humidity, extreme }
  return { values, total: Math.round(Object.values(values).reduce((sum, value) => sum + value, 0) / 5) }
}
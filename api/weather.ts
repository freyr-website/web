type WeatherRequest = { latitude?: number; longitude?: number }

export default async function weather(request: Request): Promise<Response> {
  if (request.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 })
  const body = await request.json() as WeatherRequest
  if (typeof body.latitude !== 'number' || typeof body.longitude !== 'number') return Response.json({ error: 'latitude and longitude are required' }, { status: 400 })
  const params = new URLSearchParams({ latitude: String(body.latitude), longitude: String(body.longitude), timezone: 'auto', past_days: '30', forecast_days: '7', current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m', daily: 'precipitation_sum,temperature_2m_mean,relative_humidity_2m_mean,precipitation_probability_max' })
  const upstream = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  return new Response(await upstream.text(), { status: upstream.status, headers: { 'Content-Type': 'application/json' } })
}

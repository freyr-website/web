# Freyr data flow

The browser selects a record from `src/data/vietnam-locations.json`, passes its latitude and longitude to `WeatherService`, and receives normalized data from the configured `WeatherProvider`.

- Default provider: Open-Meteo (`https://api.open-meteo.com/v1/forecast`), using current weather plus 30 days of daily history and 7 days of forecast.
- Demo provider: `VITE_WEATHER_PROVIDER=mock`; it is explicit and marked as demo.
- Cache: browser `localStorage`, keyed by latitude, longitude, date range and provider, with a 15 minute TTL.
- Analysis: Freyr computes rainfall totals, averages, wet/dry days, maximum rain and trend locally in `src/utils/weatherMetrics.ts`.
- Gemini: `GeminiAgriculturalAdvisor` receives only this structured analysis. The API key must be held by a server endpoint at `/api/agriculture/analyze`.

Serverless endpoint contracts are provided in `api/weather.ts` and `api/agriculture/analyze.ts`. The current browser provider calls Open-Meteo directly because that provider does not require a secret; deployments can switch the client to the weather proxy when required by network policy.

The repository is currently a Vite frontend, so the Gemini endpoint is an integration contract rather than a bundled server. A deployment adapter can implement it with `GEMINI_API_KEY` in server environment variables.
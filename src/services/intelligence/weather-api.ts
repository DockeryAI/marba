/**
 * OpenWeather API Integration
 * Real-time weather data for opportunity detection
 */

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

interface WeatherData {
  temperature: number
  feels_like: number
  condition: string
  description: string
  humidity: number
  wind_speed: number
  forecast: ForecastDay[]
}

interface ForecastDay {
  date: string
  temp_max: number
  temp_min: number
  condition: string
  precipitation_chance: number
}

interface WeatherOpportunity {
  type: 'heat_wave' | 'cold_snap' | 'storm' | 'precipitation' | 'seasonal'
  urgency: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  impact_score: number
  suggested_actions: string[]
}

class WeatherAPIService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()

  private getCached(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data
    this.cache.delete(key)
    return null
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getCurrentWeather(location: string): Promise<WeatherData | null> {
    const cacheKey = `current_${location}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    if (!WEATHER_API_KEY) {
      return this.getMockWeather()
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=imperial&appid=${WEATHER_API_KEY}`

      const response = await fetch(url)
      if (!response.ok) throw new Error(`Weather API error: ${response.statusText}`)

      const data = await response.json()

      const weather: WeatherData = {
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        forecast: []
      }

      this.setCache(cacheKey, weather)
      return weather
    } catch (error) {
      console.error('[Weather API] Error:', error)
      return this.getMockWeather()
    }
  }

  async get5DayForecast(location: string): Promise<ForecastDay[]> {
    const cacheKey = `forecast_${location}`
    const cached = this.getCached(cacheKey)
    if (cached) return cached

    if (!WEATHER_API_KEY) {
      return this.getMockForecast()
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=imperial&appid=${WEATHER_API_KEY}`

      const response = await fetch(url)
      if (!response.ok) throw new Error(`Weather API error: ${response.statusText}`)

      const data = await response.json()

      const dailyForecasts: ForecastDay[] = []
      const grouped: Record<string, any[]> = {}

      data.list.forEach((item: any) => {
        const date = item.dt_txt.split(' ')[0]
        if (!grouped[date]) grouped[date] = []
        grouped[date].push(item)
      })

      Object.entries(grouped).forEach(([date, items]) => {
        const temps = items.map(i => i.main.temp)
        dailyForecasts.push({
          date,
          temp_max: Math.max(...temps),
          temp_min: Math.min(...temps),
          condition: items[0].weather[0].main,
          precipitation_chance: items[0].pop * 100
        })
      })

      this.setCache(cacheKey, dailyForecasts)
      return dailyForecasts.slice(0, 5)
    } catch (error) {
      console.error('[Weather API] Error:', error)
      return this.getMockForecast()
    }
  }

  async detectWeatherOpportunities(location: string, industry: string): Promise<WeatherOpportunity[]> {
    const weather = await this.getCurrentWeather(location)
    const forecast = await this.get5DayForecast(location)

    if (!weather || !forecast) return []

    const opportunities: WeatherOpportunity[] = []

    // Heat wave detection (HVAC, pools, cooling)
    if (weather.temperature > 90) {
      opportunities.push({
        type: 'heat_wave',
        urgency: 'critical',
        title: 'Heat Wave Alert',
        description: `Temperature ${Math.round(weather.temperature)}°F - High demand for cooling services`,
        impact_score: 95,
        suggested_actions: [
          'Promote emergency AC repair services',
          'Offer heat wave specials',
          'Increase ad spend for cooling keywords',
          'Send email campaign about heat protection'
        ]
      })
    }

    // Cold snap (heating, insulation)
    if (weather.temperature < 32) {
      opportunities.push({
        type: 'cold_snap',
        urgency: 'high',
        title: 'Freezing Temperatures',
        description: `Temperature ${Math.round(weather.temperature)}°F - Heating system demand`,
        impact_score: 90,
        suggested_actions: [
          'Promote heating system checks',
          'Offer winterization services',
          'Target frozen pipe prevention messaging'
        ]
      })
    }

    // Storm/precipitation
    const upcomingRain = forecast.some(day => day.precipitation_chance > 60)
    if (upcomingRain) {
      opportunities.push({
        type: 'precipitation',
        urgency: 'medium',
        title: 'Heavy Rain Forecast',
        description: 'Rain expected - opportunity for weather-related services',
        impact_score: 70,
        suggested_actions: [
          'Promote waterproofing services',
          'Offer gutter cleaning',
          'Target flood prevention messaging'
        ]
      })
    }

    return opportunities
  }

  private getMockWeather(): WeatherData {
    return {
      temperature: 75,
      feels_like: 78,
      condition: 'Clear',
      description: 'clear sky',
      humidity: 65,
      wind_speed: 8,
      forecast: []
    }
  }

  private getMockForecast(): ForecastDay[] {
    return [
      { date: '2025-11-12', temp_max: 78, temp_min: 62, condition: 'Clear', precipitation_chance: 10 },
      { date: '2025-11-13', temp_max: 82, temp_min: 65, condition: 'Sunny', precipitation_chance: 5 },
      { date: '2025-11-14', temp_max: 85, temp_min: 68, condition: 'Sunny', precipitation_chance: 0 },
      { date: '2025-11-15', temp_max: 76, temp_min: 64, condition: 'Cloudy', precipitation_chance: 40 },
      { date: '2025-11-16', temp_max: 72, temp_min: 60, condition: 'Rain', precipitation_chance: 75 }
    ]
  }
}

export const WeatherAPI = new WeatherAPIService()
export type { WeatherData, ForecastDay, WeatherOpportunity }

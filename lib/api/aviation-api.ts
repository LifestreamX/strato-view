import axios, { AxiosError } from 'axios'
import { cache } from '@/lib/cache/memory-cache'
import { logger } from '@/lib/utils/logger'
import {
  OpenSkyResponse,
  NormalizedAircraft,
  AircraftFilters,
} from '@/types/aircraft'
import { isValidCoordinate } from '@/lib/utils/geo'

const OPENSKY_API_URL = 'https://opensky-network.org/api/states/all'
const CACHE_KEY = 'aircraft_data'
const CACHE_TTL = 10000 // 10 seconds
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

export class AviationAPIService {
  private static instance: AviationAPIService

  private constructor() {}

  static getInstance(): AviationAPIService {
    if (!AviationAPIService.instance) {
      AviationAPIService.instance = new AviationAPIService()
    }
    return AviationAPIService.instance
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async fetchWithRetry(
    retryCount = 0
  ): Promise<OpenSkyResponse | null> {
    try {
      logger.debug(`Fetching aircraft data (attempt ${retryCount + 1})`)

      const response = await axios.get<OpenSkyResponse>(OPENSKY_API_URL, {
        timeout: 15000,
        headers: {
          'User-Agent': 'StratoView/1.0',
        },
      })

      logger.apiRequest('GET', OPENSKY_API_URL, response.status)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError

      logger.apiError('GET', OPENSKY_API_URL, {
        message: axiosError.message,
        status: axiosError.response?.status,
        attempt: retryCount + 1,
      })

      if (retryCount < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
        logger.warn(`Retrying in ${delay}ms... (attempt ${retryCount + 2})`)
        await this.sleep(delay)
        return this.fetchWithRetry(retryCount + 1)
      }

      logger.error('Max retries reached, returning null')
      return null
    }
  }

  private normalizeAircraftData(
    states: (string | number | boolean | null)[][]
  ): NormalizedAircraft[] {
    const normalized: NormalizedAircraft[] = []

    for (const state of states) {
      const [
        icao24,
        callsign,
        origin_country,
        time_position,
        last_contact,
        longitude,
        latitude,
        baro_altitude,
        on_ground,
        velocity,
        true_track,
      ] = state

      // Skip aircraft without valid position
      if (!isValidCoordinate(latitude as number, longitude as number)) {
        continue
      }

      // Skip aircraft on ground
      if (on_ground) {
        continue
      }

      normalized.push({
        icao24: (icao24 as string).trim(),
        callsign: callsign ? (callsign as string).trim() : 'Unknown',
        country: (origin_country as string).trim(),
        latitude: latitude as number,
        longitude: longitude as number,
        altitude: baro_altitude as number,
        velocity: velocity as number,
        heading: true_track as number,
        lastUpdate: last_contact as number,
        onGround: on_ground as boolean,
        verticalRate: 0,
      })
    }

    return normalized
  }

  async getAircraftData(useCache = true): Promise<NormalizedAircraft[] | null> {
    // Check cache first
    if (useCache && cache.has(CACHE_KEY)) {
      logger.debug('Returning cached aircraft data')
      return cache.get<NormalizedAircraft[]>(CACHE_KEY)
    }

    // Fetch fresh data
    const response = await this.fetchWithRetry()

    if (!response || !response.states) {
      // Return cached data if API fails
      const cachedData = cache.get<NormalizedAircraft[]>(CACHE_KEY)
      if (cachedData) {
        logger.warn('API failed, using stale cache data')
        return cachedData
      }
      logger.error('No data available (API failed and no cache)')
      return null
    }

    // Normalize and cache
    const normalized = this.normalizeAircraftData(response.states)
    cache.set(CACHE_KEY, normalized, CACHE_TTL)

    logger.info(`Fetched and cached ${normalized.length} aircraft`)
    return normalized
  }

  async getFilteredAircraft(
    filters: AircraftFilters
  ): Promise<NormalizedAircraft[]> {
    const aircraft = await this.getAircraftData()

    if (!aircraft) {
      return []
    }

    return aircraft.filter(ac => {
      // Altitude filter
      if (
        filters.minAltitude !== undefined &&
        ac.altitude < filters.minAltitude
      ) {
        return false
      }
      if (
        filters.maxAltitude !== undefined &&
        ac.altitude > filters.maxAltitude
      ) {
        return false
      }

      // Speed filter
      if (filters.minSpeed !== undefined && ac.velocity < filters.minSpeed) {
        return false
      }
      if (filters.maxSpeed !== undefined && ac.velocity > filters.maxSpeed) {
        return false
      }

      // Country filter
      if (
        filters.countries &&
        filters.countries.length > 0 &&
        !filters.countries.includes(ac.country)
      ) {
        return false
      }

      // ICAO24 filter
      if (
        filters.icao24 &&
        !ac.icao24.toLowerCase().includes(filters.icao24.toLowerCase())
      ) {
        return false
      }

      // Callsign filter
      if (
        filters.callsign &&
        !ac.callsign.toLowerCase().includes(filters.callsign.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }

  clearCache(): void {
    cache.delete(CACHE_KEY)
    logger.debug('Aircraft cache cleared')
  }
}

export const aviationAPI = AviationAPIService.getInstance()

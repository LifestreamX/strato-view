import axios, { AxiosError } from 'axios'
import { nodeCache } from '@/lib/cache/node-cache'
import { logger } from '@/lib/utils/logger'
import {
  NasaNeoResponse,
  NasaNeoObject,
  NasaBrowseResponse,
  NasaLookupResponse,
  NormalizedAsteroid,
  AsteroidFilters,
  AsteroidStats,
} from '@/types/asteroid'

const NASA_NEO_FEED_URL = 'https://api.nasa.gov/neo/rest/v1/feed'
const NASA_NEO_LOOKUP_URL = 'https://api.nasa.gov/neo/rest/v1/neo'
const NASA_NEO_BROWSE_URL = 'https://api.nasa.gov/neo/rest/v1/neo/browse'

const API_KEY =
  process.env.NEXT_PUBLIC_NASA_API_KEY ||
  '7cplVJYZAhywDCJTLCvpmqJiX2Qqjme8GG4NOekB'

const CACHE_KEY_PREFIX = 'neo_data'
const CACHE_TTL = 3600000 // 1 hour - NASA data doesn't change frequently
const MAX_RETRIES = 2
const INITIAL_RETRY_DELAY = 1000 // 1 second

export class NasaAPIService {
  private static instance: NasaAPIService
  private lastFetchSource: 'live' | 'cache' | null = null
  private lastFetchTime: number | null = null

  private constructor() {}

  static getInstance(): NasaAPIService {
    if (!NasaAPIService.instance) {
      NasaAPIService.instance = new NasaAPIService()
    }
    return NasaAPIService.instance
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Fetch asteroids by date range (NASA NeoWs Feed)
   */
  async getAsteroidsByDateRange(
    startDate: string,
    endDate: string,
    useCache = true
  ): Promise<NasaNeoResponse | null> {
    const cacheKey = `${CACHE_KEY_PREFIX}_${startDate}_${endDate}`

    if (useCache) {
      const cached = nodeCache.get<NasaNeoResponse>(cacheKey)
      if (cached) {
        this.lastFetchSource = 'cache'
        this.lastFetchTime = Date.now()
        logger.debug(
          `Returning cached asteroid data for ${startDate} to ${endDate}`
        )
        return cached
      }
    }

    try {
      const response = await this.fetchWithRetry<NasaNeoResponse>(
        `${NASA_NEO_FEED_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`
      )

      if (response) {
        nodeCache.set(cacheKey, response, CACHE_TTL)
        this.lastFetchSource = 'live'
        this.lastFetchTime = Date.now()
        logger.info(
          `Fetched ${response.element_count} asteroids from NASA NeoWs API`
        )
      }

      return response
    } catch (error) {
      logger.error('Failed to fetch asteroids from NASA API', error)
      return null
    }
  }

  /**
   * Lookup specific asteroid by ID
   */
  async getAsteroidById(
    asteroidId: string,
    useCache = true
  ): Promise<NasaNeoObject | null> {
    const cacheKey = `${CACHE_KEY_PREFIX}_asteroid_${asteroidId}`

    if (useCache) {
      const cached = nodeCache.get<NasaNeoObject>(cacheKey)
      if (cached) {
        this.lastFetchSource = 'cache'
        this.lastFetchTime = Date.now()
        logger.debug(`Returning cached asteroid data for ID: ${asteroidId}`)
        return cached
      }
    }

    try {
      const response = await this.fetchWithRetry<NasaLookupResponse>(
        `${NASA_NEO_LOOKUP_URL}/${asteroidId}?api_key=${API_KEY}`
      )

      if (response) {
        nodeCache.set(cacheKey, response, CACHE_TTL)
        this.lastFetchSource = 'live'
        this.lastFetchTime = Date.now()
        logger.info(`Fetched asteroid details for ID: ${asteroidId}`)
      }

      return response
    } catch (error) {
      logger.error(`Failed to fetch asteroid ${asteroidId}`, error)
      return null
    }
  }

  /**
   * Browse all asteroids (paginated)
   */
  async browseAsteroids(
    page = 0,
    size = 20,
    useCache = true
  ): Promise<NasaBrowseResponse | null> {
    const cacheKey = `${CACHE_KEY_PREFIX}_browse_${page}_${size}`

    if (useCache) {
      const cached = nodeCache.get<NasaBrowseResponse>(cacheKey)
      if (cached) {
        this.lastFetchSource = 'cache'
        this.lastFetchTime = Date.now()
        logger.debug(`Returning cached browse data for page: ${page}`)
        return cached
      }
    }

    try {
      const response = await this.fetchWithRetry<NasaBrowseResponse>(
        `${NASA_NEO_BROWSE_URL}?page=${page}&size=${size}&api_key=${API_KEY}`
      )

      if (response) {
        nodeCache.set(cacheKey, response, CACHE_TTL)
        this.lastFetchSource = 'live'
        this.lastFetchTime = Date.now()
        logger.info(
          `Browsed ${response.near_earth_objects.length} asteroids (page ${page})`
        )
      }

      return response
    } catch (error) {
      logger.error('Failed to browse asteroids', error)
      return null
    }
  }

  /**
   * Generic fetch with retry logic
   */
  private async fetchWithRetry<T>(
    url: string,
    retryCount = 0
  ): Promise<T | null> {
    try {
      logger.debug(`Fetching from NASA API (attempt ${retryCount + 1}): ${url}`)

      const response = await axios.get<T>(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'NeoView/1.0',
        },
      })

      logger.apiRequest('GET', url, response.status)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      const status = axiosError.response?.status

      logger.apiError('GET', url, {
        message: axiosError.message,
        status,
        attempt: retryCount + 1,
      })

      // Retry on 5xx errors or network issues
      if (retryCount < MAX_RETRIES && (!status || status >= 500)) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
        logger.warn(`Retrying in ${delay}ms... (attempt ${retryCount + 2})`)
        await this.sleep(delay)
        return this.fetchWithRetry<T>(url, retryCount + 1)
      }

      return null
    }
  }

  /**
   * Normalize asteroid data for UI
   */
  normalizeAsteroid(asteroid: NasaNeoObject): NormalizedAsteroid {
    const closestApproach = asteroid.close_approach_data[0] || null

    // Add convenience properties to close approach data
    const normalizedCloseApproachData = asteroid.close_approach_data.map(
      approach => ({
        ...approach,
        closeApproachDate: approach.close_approach_date,
        relativeVelocityKmh: parseFloat(
          approach.relative_velocity.kilometers_per_hour
        ),
        missDistanceKm: parseFloat(approach.miss_distance.kilometers),
        orbitingBody: approach.orbiting_body,
      })
    )

    // Add convenience properties to orbital data
    const normalizedOrbitalData = asteroid.orbital_data
      ? {
          ...asteroid.orbital_data,
          orbitId: asteroid.orbital_data.orbit_id,
          orbitDeterminationDate:
            asteroid.orbital_data.orbit_determination_date,
          firstObservationDate: asteroid.orbital_data.first_observation_date,
          lastObservationDate: asteroid.orbital_data.last_observation_date,
        }
      : undefined

    return {
      id: asteroid.id,
      name: asteroid.name,
      isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
      estimatedDiameterKm: {
        min: asteroid.estimated_diameter.kilometers.estimated_diameter_min,
        max: asteroid.estimated_diameter.kilometers.estimated_diameter_max,
      },
      estimatedDiameterMin:
        asteroid.estimated_diameter.kilometers.estimated_diameter_min,
      estimatedDiameterMax:
        asteroid.estimated_diameter.kilometers.estimated_diameter_max,
      closeApproachDate: closestApproach?.close_approach_date || '',
      closeApproachDateFull: closestApproach?.close_approach_date_full || '',
      closeApproachData: normalizedCloseApproachData,
      missDistanceKm: parseFloat(
        closestApproach?.miss_distance.kilometers || '0'
      ),
      missDistanceLunar: parseFloat(
        closestApproach?.miss_distance.lunar || '0'
      ),
      relativeVelocityKmh: parseFloat(
        closestApproach?.relative_velocity.kilometers_per_hour || '0'
      ),
      orbitingBody: closestApproach?.orbiting_body || 'Unknown',
      absoluteMagnitude: asteroid.absolute_magnitude_h,
      nasaJplUrl: asteroid.nasa_jpl_url,
      isSentryObject: asteroid.is_sentry_object,
      orbitalData: normalizedOrbitalData,
    }
  }

  /**
   * Normalize all asteroids from a response
   */
  normalizeAsteroids(response: NasaNeoResponse): NormalizedAsteroid[] {
    const allAsteroids: NormalizedAsteroid[] = []

    for (const date in response.near_earth_objects) {
      const asteroids = response.near_earth_objects[date]
      asteroids.forEach(asteroid => {
        allAsteroids.push(this.normalizeAsteroid(asteroid))
      })
    }

    return allAsteroids
  }

  /**
   * Filter asteroids
   */
  filterAsteroids(
    asteroids: NormalizedAsteroid[],
    filters: AsteroidFilters
  ): NormalizedAsteroid[] {
    return asteroids.filter(asteroid => {
      if (
        filters.isPotentiallyHazardous !== undefined &&
        asteroid.isPotentiallyHazardous !== filters.isPotentiallyHazardous
      ) {
        return false
      }

      if (
        filters.minDiameter !== undefined &&
        asteroid.estimatedDiameterKm.max < filters.minDiameter
      ) {
        return false
      }

      if (
        filters.maxDiameter !== undefined &&
        asteroid.estimatedDiameterKm.min > filters.maxDiameter
      ) {
        return false
      }

      if (
        filters.minMissDistance !== undefined &&
        asteroid.missDistanceKm < filters.minMissDistance
      ) {
        return false
      }

      if (
        filters.maxMissDistance !== undefined &&
        asteroid.missDistanceKm > filters.maxMissDistance
      ) {
        return false
      }

      if (
        filters.orbitingBody &&
        asteroid.orbitingBody !== filters.orbitingBody
      ) {
        return false
      }

      return true
    })
  }

  /**
   * Calculate asteroid statistics
   */
  calculateStats(asteroids: NormalizedAsteroid[]): AsteroidStats {
    if (asteroids.length === 0) {
      return {
        totalCount: 0,
        hazardousCount: 0,
        avgDiameter: 0,
        averageDiameter: 0,
        closestApproach: null,
        fastestVelocity: null,
        largestDiameter: null,
        fastestAsteroid: null,
        largestAsteroid: null,
      }
    }

    const hazardousCount = asteroids.filter(
      a => a.isPotentiallyHazardous
    ).length

    const avgDiameter =
      asteroids.reduce(
        (sum, a) =>
          sum + (a.estimatedDiameterKm.min + a.estimatedDiameterKm.max) / 2,
        0
      ) / asteroids.length

    const closestAsteroid = asteroids.reduce((closest, current) =>
      current.missDistanceKm < closest.missDistanceKm ? current : closest
    )

    const fastestAsteroid = asteroids.reduce((fastest, current) =>
      current.relativeVelocityKmh > fastest.relativeVelocityKmh
        ? current
        : fastest
    )

    const largestAsteroid = asteroids.reduce((largest, current) =>
      current.estimatedDiameterKm.max > largest.estimatedDiameterKm.max
        ? current
        : largest
    )

    return {
      totalCount: asteroids.length,
      hazardousCount,
      avgDiameter,
      averageDiameter: avgDiameter,
      closestApproach: closestAsteroid
        ? {
            asteroid: closestAsteroid,
            missDistanceKm: closestAsteroid.missDistanceKm,
            date: closestAsteroid.closeApproachDate,
          }
        : null,
      fastestVelocity: fastestAsteroid,
      largestDiameter: largestAsteroid,
      fastestAsteroid: fastestAsteroid
        ? {
            asteroid: fastestAsteroid,
            velocity: fastestAsteroid.relativeVelocityKmh,
            name: fastestAsteroid.name,
          }
        : null,
      largestAsteroid: largestAsteroid
        ? {
            asteroid: largestAsteroid,
            diameter:
              (largestAsteroid.estimatedDiameterKm.min +
                largestAsteroid.estimatedDiameterKm.max) /
              2,
            name: largestAsteroid.name,
          }
        : null,
    }
  }

  /**
   * Get current fetch status
   */
  getStatus() {
    return {
      lastFetchSource: this.lastFetchSource,
      lastFetchTime: this.lastFetchTime,
    }
  }
}

// Export singleton instance
export const nasaAPI = NasaAPIService.getInstance()

// Export status function
export const getNasaStatus = () => nasaAPI.getStatus()

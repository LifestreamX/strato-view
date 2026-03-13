import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { nasaAPI, getNasaStatus } from '@/lib/api/nasa-api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const noCache = searchParams.get('noCache') === 'true'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const isPotentiallyHazardous = searchParams.get('hazardous')
    const minDiameter = searchParams.get('minDiameter')
    const maxDiameter = searchParams.get('maxDiameter')

    // Default to next 7 days if no dates provided
    const defaultStartDate = new Date().toISOString().split('T')[0]
    const defaultEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    const fetchStartDate = startDate || defaultStartDate
    const fetchEndDate = endDate || defaultEndDate

    const response = await nasaAPI.getAsteroidsByDateRange(
      fetchStartDate,
      fetchEndDate,
      !noCache
    )

    if (!response) {
      return NextResponse.json(
        {
          error: 'Failed to fetch asteroid data',
          asteroids: [],
          timestamp: Date.now(),
          count: 0,
          source: 'error',
        },
        { status: 500 }
      )
    }

    let asteroids = nasaAPI.normalizeAsteroids(response)

    // Apply filters
    const filters: any = {}
    if (isPotentiallyHazardous !== null) {
      filters.isPotentiallyHazardous = isPotentiallyHazardous === 'true'
    }
    if (minDiameter) {
      filters.minDiameter = parseFloat(minDiameter)
    }
    if (maxDiameter) {
      filters.maxDiameter = parseFloat(maxDiameter)
    }

    if (Object.keys(filters).length > 0) {
      asteroids = nasaAPI.filterAsteroids(asteroids, filters)
    }

    const stats = nasaAPI.calculateStats(asteroids)
    const status = getNasaStatus()

    console.log('[Asteroid API] Returning Data:', {
      count: asteroids.length,
      source: status.lastFetchSource,
      cached: !noCache,
      dateRange: `${fetchStartDate} to ${fetchEndDate}`,
    })

    return NextResponse.json({
      asteroids,
      stats,
      timestamp: Date.now(),
      count: asteroids.length,
      cached: !noCache,
      source: status.lastFetchSource || 'unknown',
      lastFetchTime: status.lastFetchTime,
      dateRange: {
        start: fetchStartDate,
        end: fetchEndDate,
      },
    })
  } catch (error) {
    console.error('Asteroid API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        asteroids: [],
        timestamp: Date.now(),
        count: 0,
        source: 'error',
      },
      { status: 500 }
    )
  }
}

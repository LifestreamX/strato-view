import { NextRequest, NextResponse } from 'next/server'
import { aviationAPI } from '@/lib/api/aviation-api'
import { calculateDistance } from '@/lib/utils/geo'
import { NearbyAircraft } from '@/types/aircraft'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latitude, longitude, radius } = body

    if (!latitude || !longitude || !radius) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const aircraft = await aviationAPI.getAircraftData()

    if (!aircraft) {
      return NextResponse.json(
        { error: 'Failed to fetch aircraft data', aircraft: [] },
        { status: 503 }
      )
    }

    // Calculate distance for each aircraft
    const nearby: NearbyAircraft[] = aircraft
      .map(ac => {
        const distance = calculateDistance(
          latitude,
          longitude,
          ac.latitude,
          ac.longitude
        )

        return {
          ...ac,
          distance,
        }
      })
      .filter(ac => ac.distance <= radius)
      .sort((a, b) => a.distance - b.distance)

    return NextResponse.json({
      aircraft: nearby,
      timestamp: Date.now(),
      count: nearby.length,
      userLocation: { latitude, longitude },
      radius,
    })
  } catch (error) {
    console.error('Nearby aircraft API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', aircraft: [] },
      { status: 500 }
    )
  }
}

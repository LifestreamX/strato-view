import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { aviationAPI } from '@/lib/api/aviation-api'
import { AircraftFilters } from '@/types/aircraft'

export async function POST(request: NextRequest) {
  try {
    const filters: AircraftFilters = await request.json()

    const aircraft = await aviationAPI.getFilteredAircraft(filters)

    return NextResponse.json({
      aircraft,
      timestamp: Date.now(),
      count: aircraft.length,
    })
  } catch (error) {
    console.error('Filter API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', aircraft: [] },
      { status: 500 }
    )
  }
}

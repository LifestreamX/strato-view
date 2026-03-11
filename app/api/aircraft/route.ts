import { NextRequest, NextResponse } from 'next/server'
import { aviationAPI } from '@/lib/api/aviation-api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const noCache = searchParams.get('noCache') === 'true'

    const aircraft = await aviationAPI.getAircraftData(!noCache)

    if (!aircraft) {
      return NextResponse.json(
        { error: 'Failed to fetch aircraft data', aircraft: [] },
        { status: 503 }
      )
    }

    return NextResponse.json({
      aircraft,
      timestamp: Date.now(),
      count: aircraft.length,
    })
  } catch (error) {
    console.error('Aircraft API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', aircraft: [] },
      { status: 500 }
    )
  }
}

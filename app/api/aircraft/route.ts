import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { aviationAPI } from '@/lib/api/aviation-api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const noCache = searchParams.get('noCache') === 'true'

    const aircraft = await aviationAPI.getAircraftData(!noCache)

    // Always return data, even if empty array
    return NextResponse.json({
      aircraft: aircraft || [],
      timestamp: Date.now(),
      count: (aircraft || []).length,
      cached: !noCache,
    })
  } catch (error) {
    console.error('Aircraft API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        aircraft: [],
        timestamp: Date.now(),
        count: 0,
      },
      { status: 500 }
    )
  }
}

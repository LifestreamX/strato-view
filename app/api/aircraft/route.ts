import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { aviationAPI, getAviationStatus } from '@/lib/api/aviation-api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const noCache = searchParams.get('noCache') === 'true'

    const aircraft = await aviationAPI.getAircraftData(!noCache)
    const status = getAviationStatus()

    console.log('[Aircraft API] Returning data:', {
      count: (aircraft || []).length,
      source: status.lastFetchSource,
      cached: !noCache,
    })

    // Always return data, even if empty array
    return NextResponse.json({
      aircraft: aircraft || [],
      timestamp: Date.now(),
      count: (aircraft || []).length,
      cached: !noCache,
      source: status.lastFetchSource || 'unknown',
      lastFetchTime: status.lastFetchTime,
    })
  } catch (error) {
    console.error('Aircraft API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        aircraft: [],
        timestamp: Date.now(),
        count: 0,
        source: 'error',
      },
      { status: 500 }
    )
  }
}

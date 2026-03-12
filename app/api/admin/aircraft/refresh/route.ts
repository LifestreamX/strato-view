import { NextResponse } from 'next/server'
import { aviationAPI } from '@/lib/api/aviation-api'

export async function POST() {
  try {
    // Clear cache then fetch live data (bypass cache)
    aviationAPI.clearCache()
    const data = await aviationAPI.getAircraftData(false)
    return NextResponse.json({
      ok: true,
      count: data.length,
      source: 'refresh',
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

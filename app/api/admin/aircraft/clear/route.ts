import { NextResponse } from 'next/server'
import { aviationAPI } from '@/lib/api/aviation-api'

export async function GET() {
  try {
    aviationAPI.clearCache()
    return NextResponse.json({ ok: true, message: 'Aircraft cache cleared' })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

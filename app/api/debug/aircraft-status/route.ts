import { NextResponse } from 'next/server'
import { getAviationStatus } from '@/lib/api/aviation-api'

export async function GET() {
  try {
    const status = getAviationStatus()
    return NextResponse.json({ ok: true, status })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/db/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const savedAircraft = await prisma.savedAircraft.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ savedAircraft })
  } catch (error) {
    console.error('Get saved aircraft error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { icao24, callsign, country, notes } = body

    if (!icao24) {
      return NextResponse.json({ error: 'ICAO24 is required' }, { status: 400 })
    }

    const savedAircraft = await prisma.savedAircraft.create({
      data: {
        userId: session.user.id,
        icao24,
        callsign,
        country,
        notes,
      },
    })

    return NextResponse.json({ savedAircraft })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Aircraft already saved' },
        { status: 409 }
      )
    }
    console.error('Save aircraft error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

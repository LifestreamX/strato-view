'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/ui/Navigation'

interface SavedAircraft {
  id: string
  icao24: string
  callsign: string | null
  country: string | null
  notes: string | null
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [savedAircraft, setSavedAircraft] = useState<SavedAircraft[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSavedAircraft()
    }
  }, [status])

  const fetchSavedAircraft = async () => {
    try {
      const response = await fetch('/api/user/saved-aircraft')
      const data = await response.json()

      if (response.ok) {
        setSavedAircraft(data.savedAircraft)
      }
    } catch (error) {
      console.error('Error fetching saved aircraft:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/user/saved-aircraft/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSavedAircraft(savedAircraft.filter(ac => ac.id !== id))
      }
    } catch (error) {
      console.error('Error deleting aircraft:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-aviation-dark via-blue-900 to-aviation-dark">
        <Navigation />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center text-white text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aviation-dark via-blue-900 to-aviation-dark">
      <Navigation />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Welcome back, {session?.user?.name}!
          </h2>
          <p className="text-blue-200">
            Track your favorite aircraft and manage your preferences.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Saved Aircraft</h2>

          {savedAircraft.length === 0 ? (
            <p className="text-blue-200">
              No saved aircraft yet. Click on aircraft in the map to save them!
            </p>
          ) : (
            <div className="space-y-4">
              {savedAircraft.map(aircraft => (
                <div
                  key={aircraft.id}
                  className="bg-white/5 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {aircraft.callsign || 'Unknown'}
                    </h3>
                    <p className="text-blue-200 text-sm">
                      ICAO24: {aircraft.icao24}
                    </p>
                    <p className="text-blue-200 text-sm">
                      Country: {aircraft.country}
                    </p>
                    {aircraft.notes && (
                      <p className="text-blue-300 text-sm mt-2">
                        {aircraft.notes}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(aircraft.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

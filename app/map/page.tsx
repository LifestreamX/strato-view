'use client'

import React, { useState, useEffect } from 'react'
import { useAircraftData } from '@/hooks/useAircraftData'
import dynamic from 'next/dynamic'
import { AircraftFilters, NormalizedAircraft } from '@/types/aircraft'
import { Navigation } from '@/components/ui/Navigation'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { useGeolocation } from '@/hooks/useGeolocation'

const AircraftMap = dynamic(
  () => import('@/components/map/AircraftMap').then(mod => mod.AircraftMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-aviation-dark">
        <div className="text-white text-xl">Loading map...</div>
      </div>
    ),
  }
)

export default function MapPage() {
  const { aircraft, loading, error, dataSource, lastUpdate } = useAircraftData(
    true,
    15000
  )
  const [filteredAircraft, setFilteredAircraft] = useState<
    NormalizedAircraft[]
  >([])
  const [filters, setFilters] = useState<AircraftFilters>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showNearby, setShowNearby] = useState(false)
  const [nearbyRadius, setNearbyRadius] = useState(25)

  const { location, getLocation, loading: locationLoading } = useGeolocation()

  // Log aircraft state changes for debugging
  useEffect(() => {
    console.log('[MapPage] Aircraft state updated:', {
      count: aircraft.length,
      dataSource,
      sample: aircraft.slice(0, 2).map(a => ({
        icao24: a.icao24,
        callsign: a.callsign,
      })),
    })
  }, [aircraft, dataSource])

  // (Removed duplicate polling: now handled by useAircraftData)

  // Apply filters
  useEffect(() => {
    let filtered = [...aircraft]

    if (filters.minAltitude !== undefined) {
      filtered = filtered.filter(ac => ac.altitude >= filters.minAltitude!)
    }
    if (filters.maxAltitude !== undefined) {
      filtered = filtered.filter(ac => ac.altitude <= filters.maxAltitude!)
    }
    if (filters.minSpeed !== undefined) {
      filtered = filtered.filter(ac => ac.velocity >= filters.minSpeed!)
    }
    if (filters.maxSpeed !== undefined) {
      filtered = filtered.filter(ac => ac.velocity <= filters.maxSpeed!)
    }
    if (filters.countries && filters.countries.length > 0) {
      filtered = filtered.filter(ac => filters.countries!.includes(ac.country))
    }
    if (filters.icao24) {
      filtered = filtered.filter(ac =>
        ac.icao24.toLowerCase().includes(filters.icao24!.toLowerCase())
      )
    }
    if (filters.callsign) {
      filtered = filtered.filter(ac =>
        ac.callsign.toLowerCase().includes(filters.callsign!.toLowerCase())
      )
    }

    setFilteredAircraft(filtered)
  }, [aircraft, filters])

  // Fetch nearby aircraft
  const handleFindNearby = async () => {
    if (!location) {
      getLocation()
      return
    }

    setShowNearby(true)

    try {
      const response = await fetch('/api/aircraft/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          radius: nearbyRadius,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFilteredAircraft(data.aircraft)
      }
    } catch (err) {
      console.error('Error fetching nearby aircraft:', err)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Navigation />

      <div className="flex-1 relative mt-16">
        <AircraftMap aircraft={filteredAircraft} showClusters={true} />

        <FilterPanel
          onFilterChange={setFilters}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />

        <div className="fixed top-20 left-4 z-[1000] bg-aviation-dark/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg">
          <div className="text-2xl font-bold mb-2">
            {filteredAircraft.length.toLocaleString()}
          </div>
          <div className="text-sm text-blue-200">Aircraft Tracked</div>
          <div className="mt-2 pt-2 border-t border-blue-500/30">
            <div className="text-xs text-gray-300">
              Source:{' '}
              <span
                className={
                  dataSource === 'live'
                    ? 'text-green-400 font-semibold'
                    : dataSource === 'mock'
                      ? 'text-yellow-400 font-semibold'
                      : 'text-blue-400 font-semibold'
                }
              >
                {dataSource.toUpperCase()}
              </span>
            </div>
            {lastUpdate > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                Updated: {new Date(lastUpdate).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-4 left-4 z-[1000] bg-aviation-dark/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold mb-2">Planes Above Me</h3>
          <div className="space-y-2">
            <select
              value={nearbyRadius}
              onChange={e => setNearbyRadius(Number(e.target.value))}
              className="w-full px-3 py-2 bg-aviation-dark text-white border border-aviation-blue/40 rounded focus:border-aviation-blue focus:bg-aviation-dark/90 focus:text-white hover:bg-aviation-blue/20 transition-colors duration-200 outline-none"
            >
              <option value={10}>10 miles</option>
              <option value={25}>25 miles</option>
              <option value={50}>50 miles</option>
            </select>
            <button
              onClick={handleFindNearby}
              disabled={locationLoading}
              className="w-full bg-aviation-blue hover:bg-aviation-light text-white font-semibold py-2 px-4 rounded transition duration-300 disabled:opacity-50"
            >
              {locationLoading ? 'Getting location...' : 'Find Nearby'}
            </button>
            {showNearby && location && (
              <button
                onClick={() => {
                  setShowNearby(false)
                  setFilteredAircraft(aircraft)
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                Show All
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-red-600 text-white p-4 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

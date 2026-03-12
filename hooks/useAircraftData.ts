'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { NormalizedAircraft } from '@/types/aircraft'

interface AircraftDataResponse {
  aircraft: NormalizedAircraft[]
  timestamp: number
  count: number
  cached?: boolean
  source?: string
  error?: string
}

export function useAircraftData(autoRefresh = true, interval = 30000) {
  const [aircraft, setAircraft] = useState<NormalizedAircraft[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string>('unknown')
  const [lastUpdate, setLastUpdate] = useState<number>(0)
  const lastAircraftCountRef = useRef<number>(0)
  const lastAircraftHashRef = useRef<string>('')

  // Generate simple hash of aircraft data to detect changes
  const getAircraftHash = (data: NormalizedAircraft[]): string => {
    if (!data || data.length === 0) return 'empty'
    // Use count + first/last icao24s + last update timestamp as quick hash
    return `${data.length}_${data[0]?.icao24}_${data[data.length - 1]?.icao24}`
  }

  const fetchAircraft = useCallback(async () => {
    try {
      console.log('[useAircraftData] Fetching aircraft data...')
      const response = await fetch('/api/aircraft')
      const data: AircraftDataResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch aircraft')
      }

      // Check if data has meaningfully changed before updating state
      const newAircraft = data.aircraft || []
      const newCount = newAircraft.length
      const newHash = getAircraftHash(newAircraft)
      const lastCount = lastAircraftCountRef.current
      const lastHash = lastAircraftHashRef.current

      console.log('[useAircraftData] Data check:', {
        newCount,
        lastCount,
        countChanged: newCount !== lastCount,
        hashChanged: newHash !== lastHash,
        source: data.source,
        cached: data.cached,
      })

      // Only update if: count changed OR this is first load OR hash changed
      const shouldUpdate =
        newCount !== lastCount || lastCount === 0 || newHash !== lastHash

      if (!shouldUpdate) {
        console.log(
          '[useAircraftData] Skipping update - data unchanged, preserving render'
        )
        setError(null)
        setLoading(false)
        return
      }

      // Data has changed, update state
      lastAircraftCountRef.current = newCount
      lastAircraftHashRef.current = newHash

      console.log('[useAircraftData] Received:', {
        count: data.count,
        cached: data.cached,
        source: data.source,
        aircraftSample: data.aircraft?.slice(0, 2).map(a => ({
          icao24: a.icao24,
          callsign: a.callsign,
          lat: a.latitude,
          lon: a.longitude,
        })),
      })

      // Update with the latest data from the API
      setAircraft(newAircraft)
      setDataSource(data.source || (data.cached ? 'cached' : 'live'))
      setLastUpdate(data.timestamp)
      setError(null)

      console.log('[useAircraftData] State updated:', {
        aircraftCount: newAircraft.length,
        source: data.source || (data.cached ? 'cached' : 'live'),
      })
    } catch (err: any) {
      setError(err.message)
      console.error('[useAircraftData] Error fetching aircraft:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAircraft()

    if (autoRefresh) {
      const intervalId = setInterval(fetchAircraft, interval)
      return () => clearInterval(intervalId)
    }
  }, [fetchAircraft, autoRefresh, interval])

  return {
    aircraft,
    loading,
    error,
    refetch: fetchAircraft,
    dataSource,
    lastUpdate,
  }
}

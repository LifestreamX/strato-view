'use client'

import { useState, useEffect, useCallback } from 'react'
import { NormalizedAircraft } from '@/types/aircraft'

export function useAircraftData(autoRefresh = true, interval = 10000) {
  const [aircraft, setAircraft] = useState<NormalizedAircraft[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAircraft = useCallback(async () => {
    try {
      const response = await fetch('/api/aircraft')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch aircraft')
      }

      setAircraft(data.aircraft || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching aircraft:', err)
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

  return { aircraft, loading, error, refetch: fetchAircraft }
}

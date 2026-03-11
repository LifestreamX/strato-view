'use client'

import { useState, useEffect } from 'react'

export function useGeolocation() {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setError(null)
        setLoading(false)
      },
      err => {
        setError(err.message)
        setLoading(false)
      }
    )
  }

  return { location, error, loading, getLocation }
}

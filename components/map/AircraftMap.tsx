'use client'

import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import { NormalizedAircraft } from '@/types/aircraft'
import {
  formatAltitude,
  formatSpeed,
  formatHeading,
  getCardinalDirection,
} from '@/lib/utils/geo'

// Fix for default marker icon
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  })
}

interface AircraftMapProps {
  aircraft: NormalizedAircraft[]
  center?: [number, number]
  zoom?: number
  showClusters?: boolean
  showTrails?: boolean
  onAircraftClick?: (aircraft: NormalizedAircraft) => void
}

export function AircraftMap({
  aircraft,
  center = [39.8283, -98.5795],
  zoom = 4,
  showClusters = true,
  showTrails = false,
  onAircraftClick,
}: AircraftMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerLayerRef = useRef<L.LayerGroup | null>(null)
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const trailsRef = useRef<Map<string, L.Polyline>>(new Map())
  const [isLoading, setIsLoading] = useState(true)

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current) return

    const map = L.map('map', {
      center,
      zoom,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    markerLayerRef.current = L.layerGroup().addTo(map)

    // Initialize cluster group
    if (showClusters) {
      clusterGroupRef.current = (L as any).markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        maxClusterRadius: 50,
      })
      if (clusterGroupRef.current) {
        clusterGroupRef.current.addTo(map)
      }
    }

    setIsLoading(false)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [center, zoom, showClusters])

  // Create aircraft icon
  const createAircraftIcon = (heading: number, color = '#42a5f5') => {
    return L.divIcon({
      html: `
        <div style="transform: rotate(${heading}deg); transition: transform 0.3s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}">
            <path d="M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5L21,16z"/>
          </svg>
        </div>
      `,
      className: 'aircraft-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  // Update aircraft markers
  useEffect(() => {
    if (!mapRef.current || isLoading) return

    const map = mapRef.current
    const existingMarkers = new Map(markersRef.current)
    const newMarkers = new Map<string, L.Marker>()

    // Update or create markers
    aircraft.forEach(ac => {
      const key = ac.icao24

      let marker = existingMarkers.get(key)

      if (marker) {
        // Update existing marker
        marker.setLatLng([ac.latitude, ac.longitude])
        marker.setIcon(createAircraftIcon(ac.heading || 0))
        existingMarkers.delete(key)
      } else {
        // Create new marker
        marker = L.marker([ac.latitude, ac.longitude], {
          icon: createAircraftIcon(ac.heading || 0),
        })

        const popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-lg mb-2">✈️ ${ac.callsign}</h3>
            <div class="space-y-1 text-sm">
              <p><strong>ICAO24:</strong> ${ac.icao24}</p>
              <p><strong>Country:</strong> ${ac.country}</p>
              <p><strong>Altitude:</strong> ${formatAltitude(ac.altitude)}</p>
              <p><strong>Speed:</strong> ${formatSpeed(ac.velocity)}</p>
              <p><strong>Heading:</strong> ${formatHeading(ac.heading)} ${getCardinalDirection(ac.heading)}</p>
              <p><strong>Position:</strong> ${ac.latitude.toFixed(4)}, ${ac.longitude.toFixed(4)}</p>
            </div>
          </div>
        `

        marker.bindPopup(popupContent)

        if (onAircraftClick) {
          marker.on('click', () => onAircraftClick(ac))
        }

        if (showClusters && clusterGroupRef.current) {
          clusterGroupRef.current.addLayer(marker)
        } else if (markerLayerRef.current) {
          markerLayerRef.current.addLayer(marker)
        }
      }

      newMarkers.set(key, marker)
    })

    // Remove old markers
    existingMarkers.forEach(marker => {
      if (showClusters && clusterGroupRef.current) {
        clusterGroupRef.current.removeLayer(marker)
      } else if (markerLayerRef.current) {
        markerLayerRef.current.removeLayer(marker)
      }
    })

    markersRef.current = newMarkers
  }, [aircraft, showClusters, isLoading, onAircraftClick])

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full z-0" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-aviation-dark/80 z-10">
          <div className="text-white text-xl">Loading map...</div>
        </div>
      )}
    </div>
  )
}

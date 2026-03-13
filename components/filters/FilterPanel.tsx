'use client'

import React, { useState } from 'react'
import { AircraftFilters } from '@/types/aircraft'

interface FilterPanelProps {
  onFilterChange: (filters: AircraftFilters) => void
  isOpen: boolean
  onToggle: () => void
}

export function FilterPanel({
  onFilterChange,
  isOpen,
  onToggle,
}: FilterPanelProps) {
  const [minAltitude, setMinAltitude] = useState('')
  const [maxAltitude, setMaxAltitude] = useState('')
  const [minSpeed, setMinSpeed] = useState('')
  const [maxSpeed, setMaxSpeed] = useState('')
  const [country, setCountry] = useState('')
  const [icao24, setIcao24] = useState('')
  const [callsign, setCallsign] = useState('')

  const handleApplyFilters = () => {
    const filters: AircraftFilters = {}

    if (minAltitude) filters.minAltitude = parseFloat(minAltitude)
    if (maxAltitude) filters.maxAltitude = parseFloat(maxAltitude)
    if (minSpeed) filters.minSpeed = parseFloat(minSpeed)
    if (maxSpeed) filters.maxSpeed = parseFloat(maxSpeed)
    if (country) filters.countries = [country]
    if (icao24) filters.icao24 = icao24
    if (callsign) filters.callsign = callsign

    onFilterChange(filters)
  }

  const handleReset = () => {
    setMinAltitude('')
    setMaxAltitude('')
    setMinSpeed('')
    setMaxSpeed('')
    setCountry('')
    setIcao24('')
    setCallsign('')
    onFilterChange({})
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-20 right-4 z-[1000] bg-black/60 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg hover:bg-purple-600/50 transition duration-300"
      >
        🔍 Filters
      </button>
    )
  }

  return (
    <div className="fixed top-20 right-4 z-[1000] bg-black/70 backdrop-blur-md text-white p-6 rounded-lg shadow-2xl w-80 max-h-[calc(100vh-100px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Filters</h3>
        <button
          onClick={onToggle}
          className="text-gray-300 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Altitude Range (meters)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minAltitude}
              onChange={e => setMinAltitude(e.target.value)}
              className="w-1/2 px-3 py-2 bg-white/10 rounded border border-white/20 focus:border-purple-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxAltitude}
              onChange={e => setMaxAltitude(e.target.value)}
              className="w-1/2 px-3 py-2 bg-white/10 rounded border border-white/20 focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Speed Range (m/s)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minSpeed}
              onChange={e => setMinSpeed(e.target.value)}
              className="w-1/2 px-3 py-2 bg-white/10 rounded border border-white/20 focus:border-purple-400 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxSpeed}
              onChange={e => setMaxSpeed(e.target.value)}
              className="w-1/2 px-3 py-2 bg-white/10 rounded border border-white/20 focus:border-purple-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Country</label>
          <input
            type="text"
            placeholder="e.g., United States"
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:border-purple-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ICAO24</label>
          <input
            type="text"
            placeholder="Aircraft ID"
            value={icao24}
            onChange={e => setIcao24(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:border-purple-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Callsign</label>
          <input
            type="text"
            placeholder="Flight callsign"
            value={callsign}
            onChange={e => setCallsign(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 rounded border border-white/20 focus:border-purple-400 focus:outline-none"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

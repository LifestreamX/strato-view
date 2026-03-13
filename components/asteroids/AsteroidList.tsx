'use client'

import { useState } from 'react'
import { NormalizedAsteroid, AsteroidFilters } from '@/types/asteroid'
import { AsteroidCard } from './AsteroidCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Search } from 'lucide-react'

interface AsteroidListProps {
  asteroids: NormalizedAsteroid[]
  onViewDetails?: (asteroid: NormalizedAsteroid) => void
  onToggleFavorite?: (asteroid: NormalizedAsteroid) => void
  favoriteIds?: Set<string>
}

export function AsteroidList({
  asteroids,
  onViewDetails,
  onToggleFavorite,
  favoriteIds = new Set(),
}: AsteroidListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<AsteroidFilters>({
    hazardousOnly: false,
    minDiameter: undefined,
    maxDiameter: undefined,
  })

  // Filter asteroids based on search and filters
  const filteredAsteroids = asteroids.filter(asteroid => {
    // Search filter
    if (
      searchQuery &&
      !asteroid.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Hazardous filter
    if (filters.hazardousOnly && !asteroid.isPotentiallyHazardous) {
      return false
    }

    // Diameter filters
    const avgDiameter =
      (asteroid.estimatedDiameterMin + asteroid.estimatedDiameterMax) / 2
    if (
      filters.minDiameter !== undefined &&
      avgDiameter < filters.minDiameter
    ) {
      return false
    }
    if (
      filters.maxDiameter !== undefined &&
      avgDiameter > filters.maxDiameter
    ) {
      return false
    }

    return true
  })

  const hazardousCount = filteredAsteroids.filter(
    a => a.isPotentiallyHazardous
  ).length

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4 space-y-4 bg-slate-900/50 backdrop-blur border-purple-500/20">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-purple-200">
            Search Asteroids
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              id="search"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-purple-500/30 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hazardous"
            checked={filters.hazardousOnly}
            onCheckedChange={checked =>
              setFilters(prev => ({ ...prev, hazardousOnly: checked }))
            }
          />
          <Label htmlFor="hazardous" className="text-slate-300">
            Show only potentially hazardous asteroids ({hazardousCount})
          </Label>
        </div>

        <div className="space-y-2">
          <Label className="text-purple-200">Minimum Diameter (km)</Label>
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={[filters.minDiameter || 0]}
            onValueChange={([value]) =>
              setFilters(prev => ({ ...prev, minDiameter: value || undefined }))
            }
            className="w-full"
          />
          <div className="text-sm text-slate-400">
            {filters.minDiameter
              ? `${filters.minDiameter.toFixed(1)} km`
              : 'No minimum'}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-purple-200">Maximum Diameter (km)</Label>
          <Slider
            min={0}
            max={10}
            step={0.1}
            value={[filters.maxDiameter || 10]}
            onValueChange={([value]) =>
              setFilters(prev => ({ ...prev, maxDiameter: value }))
            }
            className="w-full"
          />
          <div className="text-sm text-slate-400">
            {filters.maxDiameter
              ? `${filters.maxDiameter.toFixed(1)} km`
              : 'No maximum'}
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing{' '}
          <span className="text-purple-200 font-medium">
            {filteredAsteroids.length}
          </span>{' '}
          of{' '}
          <span className="text-purple-200 font-medium">
            {asteroids.length}
          </span>{' '}
          asteroids
        </p>
      </div>

      {/* Asteroid Grid */}
      {filteredAsteroids.length === 0 ? (
        <Card className="p-8 text-center bg-slate-900/50 backdrop-blur border-purple-500/20">
          <p className="text-slate-400">No asteroids match your filters</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAsteroids.map(asteroid => (
            <AsteroidCard
              key={asteroid.id}
              asteroid={asteroid}
              onViewDetails={onViewDetails}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favoriteIds.has(asteroid.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

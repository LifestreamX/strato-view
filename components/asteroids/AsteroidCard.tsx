'use client'

import { NormalizedAsteroid } from '@/types/asteroid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Calendar, Ruler, Gauge, Moon } from 'lucide-react'
import { format } from 'date-fns'

interface AsteroidCardProps {
  asteroid: NormalizedAsteroid
  onViewDetails?: (asteroid: NormalizedAsteroid) => void
  onToggleFavorite?: (asteroid: NormalizedAsteroid) => void
  isFavorite?: boolean
}

export function AsteroidCard({
  asteroid,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
}: AsteroidCardProps) {
  const formatDistance = (km: number) => {
    const lunarDistance = km / 384400 // Distance to moon in km
    if (lunarDistance < 1) {
      return `${km.toLocaleString()} km`
    }
    return `${lunarDistance.toFixed(2)} LD`
  }

  const formatDiameter = (min: number, max: number) => {
    const avg = (min + max) / 2
    if (avg < 1) {
      return `${(avg * 1000).toFixed(0)}m`
    }
    return `${avg.toFixed(2)}km`
  }

  const closestApproach = asteroid.closeApproachData?.[0]

  return (
    <Card className="hover:shadow-lg transition-shadow border-purple-500/20 bg-slate-900/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg text-purple-100 flex items-center gap-2">
              {asteroid.name}
              {asteroid.isPotentiallyHazardous && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Hazardous
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-slate-400">ID: {asteroid.id}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite?.(asteroid)}
            className="hover:bg-purple-500/20"
          >
            {isFavorite ? '⭐' : '☆'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Diameter */}
        <div className="flex items-center gap-2 text-sm">
          <Ruler className="w-4 h-4 text-purple-400" />
          <span className="text-slate-300">Size:</span>
          <span className="text-purple-200 font-medium">
            {formatDiameter(
              asteroid.estimatedDiameterMin,
              asteroid.estimatedDiameterMax
            )}
          </span>
        </div>

        {/* Close Approach */}
        {closestApproach && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">Approach:</span>
              <span className="text-blue-200 font-medium">
                {format(
                  new Date(closestApproach.closeApproachDate),
                  'MMM d, yyyy'
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Moon className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300">Miss Distance:</span>
              <span className="text-cyan-200 font-medium">
                {formatDistance(closestApproach.missDistanceKm)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Gauge className="w-4 h-4 text-orange-400" />
              <span className="text-slate-300">Velocity:</span>
              <span className="text-orange-200 font-medium">
                {closestApproach.relativeVelocityKmh.toLocaleString()} km/h
              </span>
            </div>
          </>
        )}

        {/* NASA JPL Link */}
        <div className="pt-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-purple-500/50 hover:bg-purple-500/20"
            onClick={() => onViewDetails?.(asteroid)}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-blue-500/50 hover:bg-blue-500/20"
            asChild
          >
            <a
              href={asteroid.nasaJplUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              NASA JPL
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

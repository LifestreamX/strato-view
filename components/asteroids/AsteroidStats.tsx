'use client'

import { AsteroidStats } from '@/types/asteroid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Calendar, Ruler, Gauge, Target } from 'lucide-react'

interface AsteroidStatsDisplayProps {
  stats: AsteroidStats
}

export function AsteroidStatsDisplay({ stats }: AsteroidStatsDisplayProps) {
  const formatDistance = (km: number) => {
    const lunarDistance = km / 384400 // Distance to moon in km
    if (lunarDistance < 1) {
      return `${km.toLocaleString()} km`
    }
    return `${lunarDistance.toFixed(2)} LD`
  }

  const formatDiameter = (km: number) => {
    if (km < 1) {
      return `${(km * 1000).toFixed(0)}m`
    }
    return `${km.toFixed(2)}km`
  }

  const hazardPercentage = (
    (stats.hazardousCount / stats.totalCount) *
    100
  ).toFixed(1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Count */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-200">
            Total Asteroids
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-100">
            {stats.totalCount}
          </div>
          <p className="text-xs text-purple-300 mt-1">Near Earth Objects</p>
        </CardContent>
      </Card>

      {/* Hazardous Count */}
      <Card className="bg-gradient-to-br from-red-900/50 to-red-800/30 border-red-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Potentially Hazardous
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-100">
            {stats.hazardousCount}
          </div>
          <p className="text-xs text-red-300 mt-1">
            {hazardPercentage}% of total
          </p>
        </CardContent>
      </Card>

      {/* Closest Approach */}
      {stats.closestApproach && (
        <Card className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 border-cyan-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-cyan-200 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Closest Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-100">
              {formatDistance(stats.closestApproach.missDistanceKm)}
            </div>
            <p className="text-xs text-cyan-300 mt-1">
              {new Date(stats.closestApproach.date).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Largest Asteroid */}
      {stats.largestAsteroid && (
        <Card className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-200 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Largest Asteroid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-100">
              {formatDiameter(stats.largestAsteroid.diameter)}
            </div>
            <p className="text-xs text-orange-300 mt-1 truncate">
              {stats.largestAsteroid.name}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Fastest Asteroid */}
      {stats.fastestAsteroid && (
        <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-200 flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              Fastest Asteroid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-100">
              {stats.fastestAsteroid.velocity.toLocaleString()}
            </div>
            <p className="text-xs text-blue-300 mt-1 truncate">
              {stats.fastestAsteroid.name} • km/h
            </p>
          </CardContent>
        </Card>
      )}

      {/* Average Diameter */}
      <Card className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 border-indigo-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-indigo-200 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Average Diameter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-100">
            {formatDiameter(stats.averageDiameter)}
          </div>
          <p className="text-xs text-indigo-300 mt-1">Across all asteroids</p>
        </CardContent>
      </Card>
    </div>
  )
}

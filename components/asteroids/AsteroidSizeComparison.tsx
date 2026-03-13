'use client'

import { NormalizedAsteroid } from '@/types/asteroid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ruler } from 'lucide-react'

interface AsteroidSizeComparisonProps {
  asteroids: NormalizedAsteroid[]
}

export function AsteroidSizeComparison({
  asteroids,
}: AsteroidSizeComparisonProps) {
  // Get top 5 largest asteroids
  const largestAsteroids = [...asteroids]
    .sort((a, b) => {
      const avgA = (a.estimatedDiameterMin + a.estimatedDiameterMax) / 2
      const avgB = (b.estimatedDiameterMin + b.estimatedDiameterMax) / 2
      return avgB - avgA
    })
    .slice(0, 5)

  if (largestAsteroids.length === 0) {
    return null
  }

  // Reference sizes in meters
  const references = [
    { name: 'Human', size: 1.7, color: 'bg-blue-400' },
    { name: 'School Bus', size: 12, color: 'bg-yellow-400' },
    { name: 'Soccer Field', size: 100, color: 'bg-green-400' },
    { name: 'Eiffel Tower', size: 330, color: 'bg-gray-400' },
    { name: 'Empire State', size: 443, color: 'bg-orange-400' },
  ]

  const maxDiameter = Math.max(
    ...largestAsteroids.map(
      a => ((a.estimatedDiameterMin + a.estimatedDiameterMax) / 2) * 1000
    ),
    ...references.map(r => r.size)
  )

  const getBarWidth = (sizeInMeters: number) => {
    return (sizeInMeters / maxDiameter) * 100
  }

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-xl text-purple-200 flex items-center gap-2">
          <Ruler className="w-5 h-5" />
          Size Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Asteroids */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-purple-300">Asteroids</h3>
            {largestAsteroids.map(asteroid => {
              const avgDiameterKm =
                (asteroid.estimatedDiameterMin +
                  asteroid.estimatedDiameterMax) /
                2
              const avgDiameterM = avgDiameterKm * 1000
              const barWidth = getBarWidth(avgDiameterM)

              return (
                <div key={asteroid.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 truncate max-w-[60%]">
                      {asteroid.name}
                    </span>
                    <span className="text-purple-200 font-medium">
                      {avgDiameterM >= 1000
                        ? `${avgDiameterKm.toFixed(2)} km`
                        : `${avgDiameterM.toFixed(0)} m`}
                    </span>
                  </div>
                  <div className="h-8 bg-slate-800/50 rounded-lg overflow-hidden">
                    <div
                      className={`h-full flex items-center px-2 transition-all duration-300 ${
                        asteroid.isPotentiallyHazardous
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : 'bg-gradient-to-r from-purple-500 to-purple-600'
                      }`}
                      style={{ width: `${Math.max(barWidth, 5)}%` }}
                    >
                      {barWidth > 15 && (
                        <span className="text-xs text-white font-medium truncate">
                          {asteroid.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Reference objects */}
          <div className="space-y-3 pt-3 border-t border-purple-500/20">
            <h3 className="text-sm font-medium text-slate-400">
              Reference Objects
            </h3>
            {references.map(ref => {
              const barWidth = getBarWidth(ref.size)

              return (
                <div key={ref.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{ref.name}</span>
                    <span className="text-slate-500 font-medium">
                      {ref.size >= 1000
                        ? `${(ref.size / 1000).toFixed(2)} km`
                        : `${ref.size} m`}
                    </span>
                  </div>
                  <div className="h-6 bg-slate-800/30 rounded-lg overflow-hidden">
                    <div
                      className={`h-full ${ref.color} opacity-60`}
                      style={{ width: `${Math.max(barWidth, 2)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Scale note */}
          <p className="text-xs text-slate-500 pt-2">
            * Bars are scaled logarithmically for better visualization
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

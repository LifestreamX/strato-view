'use client'

import { NormalizedAsteroid } from '@/types/asteroid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format, differenceInDays } from 'date-fns'
import { Calendar, AlertTriangle } from 'lucide-react'

interface AsteroidTimelineProps {
  asteroids: NormalizedAsteroid[]
}

export function AsteroidTimeline({ asteroids }: AsteroidTimelineProps) {
  // Sort asteroids by closest approach date
  const sortedAsteroids = [...asteroids]
    .filter(a => a.closeApproachData && a.closeApproachData.length > 0)
    .sort((a, b) => {
      const dateA = new Date(a.closeApproachData![0].closeApproachDate)
      const dateB = new Date(b.closeApproachData![0].closeApproachDate)
      return dateA.getTime() - dateB.getTime()
    })
    .slice(0, 10) // Show top 10 closest approaches

  if (sortedAsteroids.length === 0) {
    return null
  }

  const today = new Date()
  const latestDate = new Date(
    sortedAsteroids[sortedAsteroids.length - 1].closeApproachData![0]
      .closeApproachDate
  )
  const totalDays = Math.max(differenceInDays(latestDate, today), 7)

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-xl text-purple-200 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Upcoming Close Approaches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline visualization */}
          <div className="relative pt-4 pb-2">
            {/* Timeline bar */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-500/30" />

            {/* Timeline items */}
            <div className="space-y-6">
              {sortedAsteroids.map(asteroid => {
                const approach = asteroid.closeApproachData![0]
                const approachDate = new Date(approach.closeApproachDate)
                const daysUntil = differenceInDays(approachDate, today)
                const lunarDistance = (
                  approach.missDistanceKm / 384400
                ).toFixed(2)

                return (
                  <div key={asteroid.id} className="relative pl-16">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-6 top-2 w-4 h-4 rounded-full border-2 ${
                        asteroid.isPotentiallyHazardous
                          ? 'bg-red-500 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                          : 'bg-purple-500 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                      }`}
                    />

                    {/* Content */}
                    <div className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-800/70 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-purple-100 truncate">
                              {asteroid.name}
                            </h4>
                            {asteroid.isPotentiallyHazardous && (
                              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-slate-400">
                            {format(approachDate, 'MMM d, yyyy')} •{' '}
                            {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-cyan-300">
                            {lunarDistance} LD
                          </p>
                          <p className="text-xs text-slate-500">
                            {(approach.missDistanceKm / 1000000).toFixed(2)}M km
                          </p>
                        </div>
                      </div>

                      {/* Additional info */}
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span>
                          Ø{' '}
                          {(
                            ((asteroid.estimatedDiameterMin +
                              asteroid.estimatedDiameterMax) /
                              2) *
                            1000
                          ).toFixed(0)}
                          m
                        </span>
                        <span>
                          {approach.relativeVelocityKmh.toLocaleString()} km/h
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Today marker */}
            <div className="absolute left-0 top-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <span className="text-xs font-medium text-blue-300">Today</span>
            </div>
          </div>

          {/* Legend */}
          <div className="pt-4 border-t border-purple-500/20 flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400" />
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 border border-red-400" />
              <span>Potentially Hazardous</span>
            </div>
            <div className="ml-auto">LD = Lunar Distance (384,400 km)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

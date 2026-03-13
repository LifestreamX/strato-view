'use client'

import { NormalizedAsteroid } from '@/types/asteroid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Moon, Target } from 'lucide-react'

interface AsteroidDistanceVisualizerProps {
  asteroid: NormalizedAsteroid
}

export function AsteroidDistanceVisualizer({
  asteroid,
}: AsteroidDistanceVisualizerProps) {
  if (!asteroid.closeApproachData || asteroid.closeApproachData.length === 0) {
    return null
  }

  const approach = asteroid.closeApproachData[0]
  const missDistanceKm = approach.missDistanceKm
  const lunarDistance = missDistanceKm / 384400 // Distance to moon

  // Calculate positions for visualization (scaled)
  const earthPosition = 5 // Fixed at 5%
  const moonPosition = 35 // Fixed at 35% (represents 1 LD)

  // Calculate asteroid position relative to Earth-Moon distance
  let asteroidPosition: number
  if (lunarDistance <= 3) {
    // If within 3 LD, scale linearly
    asteroidPosition =
      earthPosition + (moonPosition - earthPosition) * lunarDistance
  } else {
    // If beyond 3 LD, show it farther out
    asteroidPosition = Math.min(95, moonPosition + lunarDistance * 10)
  }

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-lg text-purple-200 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Distance Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visualization */}
        <div className="relative h-32 bg-slate-950/50 rounded-lg p-4">
          {/* Distance line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-transparent" />

          {/* Earth */}
          <div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${earthPosition}%` }}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-green-400 shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
              <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            </div>
            <span className="text-xs text-blue-300 mt-2 font-medium">
              Earth
            </span>
          </div>

          {/* Moon */}
          {lunarDistance > 0.3 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${moonPosition}%` }}
            >
              <div className="relative">
                <Moon className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-xs text-slate-400 mt-2">Moon</span>
              <span className="text-xs text-slate-500">1 LD</span>
            </div>
          )}

          {/* Asteroid */}
          <div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${asteroidPosition}%` }}
          >
            <div className="relative">
              <div
                className={`w-6 h-6 rounded-full ${
                  asteroid.isPotentiallyHazardous
                    ? 'bg-gradient-to-br from-red-500 to-orange-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]'
                }`}
              />
              <div className="absolute inset-0 rounded-full bg-white/30 animate-pulse" />
            </div>
            <span className="text-xs text-purple-300 mt-2 font-medium truncate max-w-[100px]">
              {asteroid.name}
            </span>
            <span className="text-xs text-slate-500">
              {lunarDistance.toFixed(2)} LD
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-500/20">
          <div>
            <p className="text-sm text-slate-400">Miss Distance</p>
            <p className="text-lg font-medium text-purple-200">
              {missDistanceKm.toLocaleString()} km
            </p>
            <p className="text-xs text-slate-500">
              {lunarDistance.toFixed(4)} Lunar Distances
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Relative to Moon</p>
            <p className="text-lg font-medium text-cyan-200">
              {lunarDistance < 1
                ? `${(lunarDistance * 100).toFixed(1)}% of LD`
                : `${lunarDistance.toFixed(2)}x farther`}
            </p>
            <p className="text-xs text-slate-500">Moon orbit: 384,400 km</p>
          </div>
        </div>

        {/* Safety indicator */}
        <div
          className={`p-3 rounded-lg ${
            asteroid.isPotentiallyHazardous
              ? 'bg-red-500/10 border border-red-500/30'
              : 'bg-green-500/10 border border-green-500/30'
          }`}
        >
          <p className="text-sm">
            {asteroid.isPotentiallyHazardous ? (
              <span className="text-red-300">
                ⚠️ Classified as potentially hazardous due to size and proximity
              </span>
            ) : (
              <span className="text-green-300">
                ✓ Safe distance - no immediate threat
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

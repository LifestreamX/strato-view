export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function isValidCoordinate(
  latitude: number | null,
  longitude: number | null
): boolean {
  if (latitude === null || longitude === null) return false
  if (isNaN(latitude) || isNaN(longitude)) return false
  if (latitude < -90 || latitude > 90) return false
  if (longitude < -180 || longitude > 180) return false
  return true
}

export function metersToFeet(meters: number): number {
  return meters * 3.28084
}

export function metersPerSecondToKnots(mps: number): number {
  return mps * 1.94384
}

export function formatAltitude(meters: number | null): string {
  if (meters === null) return 'N/A'
  const feet = metersToFeet(meters)
  return `${Math.round(feet).toLocaleString()} ft`
}

export function formatSpeed(mps: number | null): string {
  if (mps === null) return 'N/A'
  const knots = metersPerSecondToKnots(mps)
  return `${Math.round(knots)} kts`
}

export function formatHeading(degrees: number | null): string {
  if (degrees === null) return 'N/A'
  return `${Math.round(degrees)}°`
}

export function getCardinalDirection(degrees: number | null): string {
  if (degrees === null) return 'N/A'

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

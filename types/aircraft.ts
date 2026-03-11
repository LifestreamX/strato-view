export interface AircraftState {
  icao24: string
  callsign: string | null
  origin_country: string
  time_position: number | null
  last_contact: number
  longitude: number | null
  latitude: number | null
  baro_altitude: number | null
  on_ground: boolean
  velocity: number | null
  true_track: number | null
  vertical_rate: number | null
  sensors: number[] | null
  geo_altitude: number | null
  squawk: string | null
  spi: boolean
  position_source: number
}

export interface OpenSkyResponse {
  time: number
  states: (string | number | boolean | null)[][] | null
}

export interface NormalizedAircraft {
  icao24: string
  callsign: string
  country: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  heading: number
  lastUpdate: number
  onGround: boolean
  verticalRate: number
}

export interface AircraftFilters {
  minAltitude?: number
  maxAltitude?: number
  minSpeed?: number
  maxSpeed?: number
  countries?: string[]
  icao24?: string
  callsign?: string
}

export interface UserLocation {
  latitude: number
  longitude: number
}

export interface NearbyAircraft extends NormalizedAircraft {
  distance: number
}

export interface AircraftTrail {
  icao24: string
  positions: Array<{
    lat: number
    lng: number
    timestamp: number
  }>
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt: number
}

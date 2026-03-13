// Used for the /api/aircraft/nearby endpoint
export interface NearbyAircraft extends NormalizedAircraft {
  distance: number;
}
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
  states: AircraftState[]
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
  verticalRate: number
  onGround: boolean
  lastContact: number
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

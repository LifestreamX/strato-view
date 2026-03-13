// NASA NeoWs API Response Types
export interface NasaNeoResponse {
  links: {
    next?: string
    prev?: string
    self: string
  }
  element_count: number
  near_earth_objects: {
    [date: string]: NasaNeoObject[]
  }
}

export interface NasaNeoObject {
  links: {
    self: string
  }
  id: string
  neo_reference_id: string
  name: string
  name_limited?: string
  designation?: string
  nasa_jpl_url: string
  absolute_magnitude_h: number
  estimated_diameter: {
    kilometers: DiameterRange
    meters: DiameterRange
    miles: DiameterRange
    feet: DiameterRange
  }
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: CloseApproachData[]
  is_sentry_object: boolean
  orbital_data?: OrbitalData
}

export interface DiameterRange {
  estimated_diameter_min: number
  estimated_diameter_max: number
}

export interface CloseApproachData {
  close_approach_date: string
  close_approach_date_full: string
  epoch_date_close_approach: number
  relative_velocity: {
    kilometers_per_second: string
    kilometers_per_hour: string
    miles_per_hour: string
  }
  miss_distance: {
    astronomical: string
    lunar: string
    kilometers: string
    miles: string
  }
  orbiting_body: string
  // Convenience properties for components (added during normalization)
  closeApproachDate: string
  relativeVelocityKmh: number
  missDistanceKm: number
  orbitingBody: string
}

export interface OrbitalData {
  orbit_id: string
  orbit_determination_date: string
  first_observation_date: string
  last_observation_date: string
  data_arc_in_days: number
  observations_used: number
  orbit_uncertainty: string
  minimum_orbit_intersection: string
  jupiter_tisserand_invariant: string
  epoch_osculation: string
  eccentricity: string
  semi_major_axis: string
  inclination: string
  ascending_node_longitude: string
  orbital_period: string
  perihelion_distance: string
  perihelion_argument: string
  aphelion_distance: string
  perihelion_time: string
  mean_anomaly: string
  mean_motion: string
  equinox: string
  // Convenience properties for components (added during normalization)
  orbitId: string
  orbitDeterminationDate: string
  firstObservationDate: string
  lastObservationDate: string
}

// Normalized asteroid for UI
export interface NormalizedAsteroid {
  id: string
  name: string
  isPotentiallyHazardous: boolean
  estimatedDiameterKm: {
    min: number
    max: number
  }
  // Convenience properties for components
  estimatedDiameterMin: number
  estimatedDiameterMax: number
  closeApproachDate: string
  closeApproachDateFull: string
  closeApproachData?: CloseApproachData[]
  missDistanceKm: number
  missDistanceLunar: number
  relativeVelocityKmh: number
  orbitingBody: string
  absoluteMagnitude: number
  nasaJplUrl: string
  isSentryObject: boolean
  orbitalData?: OrbitalData
}

// Filter options
export interface AsteroidFilters {
  startDate?: string
  endDate?: string
  isPotentiallyHazardous?: boolean
  hazardousOnly?: boolean
  minDiameter?: number
  maxDiameter?: number
  minMissDistance?: number
  maxMissDistance?: number
  orbitingBody?: string
}

// Asteroid statistics
export interface AsteroidStats {
  totalCount: number
  hazardousCount: number
  avgDiameter: number
  averageDiameter: number
  closestApproach: {
    asteroid: NormalizedAsteroid
    missDistanceKm: number
    date: string
  } | null
  fastestAsteroid: {
    asteroid: NormalizedAsteroid
    velocity: number
    name: string
  } | null
  largestAsteroid: {
    asteroid: NormalizedAsteroid
    diameter: number
    name: string
  } | null
  fastestVelocity: NormalizedAsteroid | null
  largestDiameter: NormalizedAsteroid | null
}

// Browse API response
export interface NasaBrowseResponse {
  links: {
    next: string
    prev?: string
    self: string
  }
  page: {
    size: number
    total_elements: number
    total_pages: number
    number: number
  }
  near_earth_objects: NasaNeoObject[]
}

// Lookup API response (single asteroid)
export interface NasaLookupResponse extends NasaNeoObject {}

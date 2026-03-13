import { nasaAPI } from '../../lib/api/nasa-api'
import { NormalizedAsteroid } from '../../types/asteroid'

describe('NasaAPIService', () => {
  const mockAsteroid = {
    links: { self: '' },
    id: '12345',
    neo_reference_id: '12345',
    name: 'Test Asteroid',
    nasa_jpl_url: 'http://example.com',
    absolute_magnitude_h: 15.5,
    estimated_diameter: {
      kilometers: { estimated_diameter_min: 0.1, estimated_diameter_max: 0.2 },
      meters: { estimated_diameter_min: 100, estimated_diameter_max: 200 },
      miles: { estimated_diameter_min: 0.06, estimated_diameter_max: 0.12 },
      feet: { estimated_diameter_min: 328, estimated_diameter_max: 656 },
    },
    is_potentially_hazardous_asteroid: true,
    close_approach_data: [
      {
        close_approach_date: '2026-03-12',
        close_approach_date_full: '2026-Mar-12 12:00',
        epoch_date_close_approach: 1773316800000,
        relative_velocity: {
          kilometers_per_second: '10',
          kilometers_per_hour: '36000',
          miles_per_hour: '22369',
        },
        miss_distance: {
          astronomical: '0.01',
          lunar: '3.89',
          kilometers: '1500000',
          miles: '932056',
        },
        orbiting_body: 'Earth',
      },
    ],
    is_sentry_object: false,
    orbital_data: {
      orbit_id: '1',
      orbit_determination_date: '2026-01-01',
      first_observation_date: '2020-01-01',
      last_observation_date: '2026-01-01',
      data_arc_in_days: 2191,
      observations_used: 100,
      orbit_uncertainty: '0',
      minimum_orbit_intersection: '0.01',
      jupiter_tisserand_invariant: '5.2',
      epoch_osculation: '2460000.5',
      eccentricity: '0.1',
      semi_major_axis: '1.5',
      inclination: '5.0',
      ascending_node_longitude: '100.0',
      orbital_period: '600.0',
      perihelion_distance: '1.35',
      perihelion_argument: '200.0',
      aphelion_distance: '1.65',
      perihelion_time: '2460100.5',
      mean_anomaly: '50.0',
      mean_motion: '0.6',
      equinox: 'J2000',
    },
  }

  test('should normalize asteroid data correctly', () => {
    const normalized = nasaAPI.normalizeAsteroid(mockAsteroid as any)

    expect(normalized.id).toBe('12345')
    expect(normalized.name).toBe('Test Asteroid')
    expect(normalized.isPotentiallyHazardous).toBe(true)
    expect(normalized.estimatedDiameterKm.min).toBe(0.1)
    expect(normalized.estimatedDiameterKm.max).toBe(0.2)
    expect(normalized.closeApproachDate).toBe('2026-03-12')
    expect(normalized.missDistanceKm).toBe(1500000)
    expect(normalized.relativeVelocityKmh).toBe(36000)
  })

  test('should calculate statistics correctly', () => {
    const normalized1 = nasaAPI.normalizeAsteroid(mockAsteroid as any)
    const normalized2: NormalizedAsteroid = {
      ...normalized1,
      id: '67890',
      name: 'Small Safe Asteroid',
      isPotentiallyHazardous: false,
      estimatedDiameterKm: { min: 0.01, max: 0.02 },
      estimatedDiameterMin: 0.01,
      estimatedDiameterMax: 0.02,
      missDistanceKm: 5000000,
      relativeVelocityKmh: 20000,
    }

    const stats = nasaAPI.calculateStats([normalized1, normalized2])

    expect(stats.totalCount).toBe(2)
    expect(stats.hazardousCount).toBe(1)
    expect(stats.averageDiameter).toBeCloseTo((0.15 + 0.015) / 2)
    expect(stats.closestApproach?.asteroid.id).toBe('12345') // 1.5M vs 5M
    expect(stats.fastestAsteroid?.asteroid.id).toBe('12345') // 36k vs 20k
    expect(stats.largestAsteroid?.asteroid.id).toBe('12345') // 0.15 vs 0.015
  })

  test('should filter asteroids correctly', () => {
    const normalized1 = nasaAPI.normalizeAsteroid(mockAsteroid as any)
    const normalized2: NormalizedAsteroid = {
      ...normalized1,
      id: '67890',
      isPotentiallyHazardous: false,
      estimatedDiameterKm: { min: 0.5, max: 0.6 },
      estimatedDiameterMin: 0.5,
      estimatedDiameterMax: 0.6,
    }

    const hazardous = nasaAPI.filterAsteroids([normalized1, normalized2], {
      isPotentiallyHazardous: true,
    })
    expect(hazardous.length).toBe(1)
    expect(hazardous[0].id).toBe('12345')

    const large = nasaAPI.filterAsteroids([normalized1, normalized2], {
      minDiameter: 0.4,
    })
    expect(large.length).toBe(1)
    expect(large[0].id).toBe('67890')
  })
})

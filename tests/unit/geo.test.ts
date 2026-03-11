import {
  calculateDistance,
  isValidCoordinate,
  metersToFeet,
  metersPerSecondToKnots,
  formatAltitude,
  formatSpeed,
  formatHeading,
  getCardinalDirection,
} from '@/lib/utils/geo'

describe('Geo Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const distance = calculateDistance(40.7128, -74.006, 34.0522, -118.2437)
      expect(distance).toBeGreaterThan(2400)
      expect(distance).toBeLessThan(2500)
    })

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(40.7128, -74.006, 40.7128, -74.006)
      expect(distance).toBe(0)
    })
  })

  describe('isValidCoordinate', () => {
    it('should validate correct coordinates', () => {
      expect(isValidCoordinate(40.7128, -74.006)).toBe(true)
      expect(isValidCoordinate(0, 0)).toBe(true)
      expect(isValidCoordinate(90, 180)).toBe(true)
      expect(isValidCoordinate(-90, -180)).toBe(true)
    })

    it('should reject invalid coordinates', () => {
      expect(isValidCoordinate(null, null)).toBe(false)
      expect(isValidCoordinate(91, 0)).toBe(false)
      expect(isValidCoordinate(0, 181)).toBe(false)
      expect(isValidCoordinate(NaN, 0)).toBe(false)
    })
  })

  describe('metersToFeet', () => {
    it('should convert meters to feet', () => {
      expect(metersToFeet(1000)).toBeCloseTo(3280.84, 1)
      expect(metersToFeet(0)).toBe(0)
    })
  })

  describe('metersPerSecondToKnots', () => {
    it('should convert m/s to knots', () => {
      expect(metersPerSecondToKnots(100)).toBeCloseTo(194.384, 1)
      expect(metersPerSecondToKnots(0)).toBe(0)
    })
  })

  describe('formatAltitude', () => {
    it('should format altitude', () => {
      expect(formatAltitude(1000)).toContain('ft')
      expect(formatAltitude(null)).toBe('N/A')
    })
  })

  describe('formatSpeed', () => {
    it('should format speed', () => {
      expect(formatSpeed(100)).toContain('kts')
      expect(formatSpeed(null)).toBe('N/A')
    })
  })

  describe('formatHeading', () => {
    it('should format heading', () => {
      expect(formatHeading(180)).toBe('180°')
      expect(formatHeading(null)).toBe('N/A')
    })
  })

  describe('getCardinalDirection', () => {
    it('should return correct cardinal directions', () => {
      expect(getCardinalDirection(0)).toBe('N')
      expect(getCardinalDirection(45)).toBe('NE')
      expect(getCardinalDirection(90)).toBe('E')
      expect(getCardinalDirection(180)).toBe('S')
      expect(getCardinalDirection(270)).toBe('W')
      expect(getCardinalDirection(null)).toBe('N/A')
    })
  })
})

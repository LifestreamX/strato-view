import { cache } from '@/lib/cache/memory-cache'

describe('Memory Cache', () => {
  beforeEach(() => {
    cache.clear()
  })

  it('should set and get values', () => {
    cache.set('test', 'value')
    expect(cache.get('test')).toBe('value')
  })

  it('should return null for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeNull()
  })

  it('should check if key exists', () => {
    cache.set('test', 'value')
    expect(cache.has('test')).toBe(true)
    expect(cache.has('nonexistent')).toBe(false)
  })

  it('should delete keys', () => {
    cache.set('test', 'value')
    cache.delete('test')
    expect(cache.has('test')).toBe(false)
  })

  it('should respect TTL', async () => {
    cache.set('test', 'value', 100) // 100ms TTL
    expect(cache.get('test')).toBe('value')

    await new Promise(resolve => setTimeout(resolve, 150))
    expect(cache.get('test')).toBeNull()
  })

  it('should clear all entries', () => {
    cache.set('test1', 'value1')
    cache.set('test2', 'value2')
    cache.clear()
    expect(cache.size()).toBe(0)
  })

  it('should cleanup expired entries', async () => {
    cache.set('test1', 'value1', 50)
    cache.set('test2', 'value2', 10000)

    await new Promise(resolve => setTimeout(resolve, 100))
    cache.cleanup()

    expect(cache.has('test1')).toBe(false)
    expect(cache.has('test2')).toBe(true)
  })
})

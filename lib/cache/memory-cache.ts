import { CacheEntry } from '@/types/aircraft'

class MemoryCache {
  private cache: Map<string, CacheEntry<any>>
  private readonly defaultTTL: number = 10000 // 10 seconds

  constructor() {
    this.cache = new Map()
  }

  set<T>(key: string, value: T, ttl?: number): void {
    const now = Date.now()
    const expiresAt = now + (ttl ?? this.defaultTTL)

    this.cache.set(key, {
      data: value,
      timestamp: now,
      expiresAt,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    const now = Date.now()

    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)

    if (!entry) {
      return false
    }

    const now = Date.now()

    if (now > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  cleanup(): void {
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  size(): number {
    return this.cache.size
  }
}

// Global cache instance
const globalForCache = globalThis as unknown as {
  cache: MemoryCache | undefined
}

export const cache = globalForCache.cache ?? new MemoryCache()

if (process.env.NODE_ENV !== 'production') globalForCache.cache = cache

// Cleanup expired entries every minute
if (typeof window === 'undefined') {
  setInterval(() => {
    cache.cleanup()
  }, 60000)
}

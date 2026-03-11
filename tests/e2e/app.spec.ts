import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/StratoView/i)
  })

  test('should have navigation links', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=View Live Map')).toBeVisible()
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })

  test('should navigate to map page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=View Live Map')
    await expect(page).toHaveURL(/\/map/)
  })

  test('should display feature cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Global Coverage')).toBeVisible()
    await expect(page.locator('text=Advanced Filters')).toBeVisible()
    await expect(page.locator('text=Planes Above Me')).toBeVisible()
  })
})

test.describe('Map Page', () => {
  test('should load the map page', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('#map')).toBeVisible()
  })

  test('should display aircraft count', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('text=Aircraft Tracked')).toBeVisible()
  })

  test('should have filter button', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('text=Filters')).toBeVisible()
  })

  test('should open filter panel', async ({ page }) => {
    await page.goto('/map')
    await page.click('text=Filters')
    await expect(page.locator('input[placeholder="Min"]')).toBeVisible()
  })

  test('should have nearby aircraft feature', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('text=Planes Above Me')).toBeVisible()
    await expect(page.locator('text=Find Nearby')).toBeVisible()
  })
})

test.describe('Authentication', () => {
  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sign In')
    await expect(page).toHaveURL(/\/auth\/signin/)
  })

  test('should display Google sign in button', async ({ page }) => {
    await page.goto('/auth/signin')
    await expect(page.locator('text=Sign in with Google')).toBeVisible()
  })

  test('should have back to home link', async ({ page }) => {
    await page.goto('/auth/signin')
    await expect(page.locator('text=Back to Home')).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('should have navigation bar on all pages', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=STRATOVIEW')).toBeVisible()

    await page.goto('/map')
    await expect(page.locator('text=STRATOVIEW')).toBeVisible()
  })

  test('should toggle mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const menuButton = page.locator('button:has-text("☰")')
    await menuButton.click()

    await expect(page.locator('text=Live Map')).toBeVisible()
  })
})

test.describe('API Integration', () => {
  test('should fetch aircraft data', async ({ page }) => {
    const response = await page.request.get('/api/aircraft')
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data).toHaveProperty('aircraft')
    expect(Array.isArray(data.aircraft)).toBeTruthy()
  })

  test('should handle aircraft filtering', async ({ page }) => {
    const response = await page.request.post('/api/aircraft/filter', {
      data: {
        minAltitude: 1000,
        maxAltitude: 10000,
      },
    })
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data).toHaveProperty('aircraft')
  })
})

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page.locator('text=STRATOVIEW')).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    await expect(page.locator('text=STRATOVIEW')).toBeVisible()
  })

  test('should be responsive on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    await expect(page.locator('text=STRATOVIEW')).toBeVisible()
  })
})

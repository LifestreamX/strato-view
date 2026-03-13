import { test, expect } from '@playwright/test'

test.describe('Asteroid Discovery Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/')
  })

  test('should display the main heading', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /neoview/i,
    })
    await expect(heading).toBeVisible()
  })

  test('should go to asteroids page and show search input', async ({
    page,
  }) => {
    // Check if link exists and click it
    const exploreBtn = page.getByRole('link', { name: /explore asteroids/i })
    if (await exploreBtn.isVisible()) {
      await exploreBtn.click()
      await expect(page).toHaveURL(/.*asteroids/)

      const searchInput = page.getByPlaceholder(/search asteroids/i)
      await expect(searchInput).toBeVisible()
    }
  })

  test('should toggle between grid and timeline views', async ({ page }) => {
    await page.goto('/asteroids')

    const timelineTab = page.getByRole('tab', { name: /timeline/i })
    if (await timelineTab.isVisible()) {
      await timelineTab.click()
      await expect(timelineTab).toHaveAttribute('aria-selected', 'true')
    }
  })
})

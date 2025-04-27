import { test, expect } from '@playwright/test'

test('visits the app root url', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('/')

  // Take a screenshot to help debug
  await page.screenshot({ path: 'homepage.png' })

  // Get actual page content for debugging
  const content = await page.content()
  console.log('Page content length:', content.length)

  // Check for h1 with stock dashboard title
  await expect(page.locator('.title')).toBeVisible()

  // Print actual text to help debug
  const h1Text = await page.locator('.title').textContent()
  console.log('Found h1 text:', h1Text)

  // Now check for the correct text in your app
  await expect(page.locator('.title')).toHaveText('Stock Dashboard')
})

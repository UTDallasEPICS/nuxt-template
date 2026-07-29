import { expect, test } from '@playwright/test'

const exampleEmail = 'member@example.test'

async function waitForHydration(page: import('@playwright/test').Page) {
  await expect(page.locator('html')).toHaveAttribute('data-test-ready', 'true', {
    timeout: 20_000,
  })
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/**', async (route) => {
    const request = route.request()
    const pathname = new URL(request.url()).pathname

    if (pathname.endsWith('/get-session')) {
      await route.fulfill({ json: null })
      return
    }

    if (pathname.endsWith('/email-otp/send-verification-otp')) {
      await route.fulfill({ json: { success: true } })
      return
    }

    await route.fulfill({
      status: 503,
      json: { message: `Unexpected mocked auth request: ${pathname}` },
    })
  })
})

test('submits a valid email and advances to the OTP step', async ({ page }) => {
  await page.goto('/auth')
  await waitForHydration(page)

  const emailInput = page.getByRole('textbox', { name: 'Email' })
  await emailInput.fill(exampleEmail)

  const otpRequest = page.waitForRequest((request) =>
    new URL(request.url()).pathname.endsWith('/email-otp/send-verification-otp')
  )
  await page.getByRole('button', { name: 'Send OTP' }).click()

  const request = await otpRequest
  expect(request.postDataJSON()).toMatchObject({
    email: exampleEmail,
    type: 'sign-in',
  })
  await expect(page.getByText('One-time password')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
})

test('shows email validation and does not request an OTP', async ({ page }) => {
  const otpRequests: string[] = []
  page.on('request', (request) => {
    if (new URL(request.url()).pathname.endsWith('/email-otp/send-verification-otp')) {
      otpRequests.push(request.url())
    }
  })

  await page.goto('/auth')
  await waitForHydration(page)
  await page.getByRole('textbox', { name: 'Email' }).fill('not-an-email')
  await page.getByRole('button', { name: 'Send OTP' }).click()

  await expect(page.getByText('Invalid email')).toBeVisible()
  expect(otpRequests).toHaveLength(0)
})

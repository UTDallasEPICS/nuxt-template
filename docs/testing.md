# Testing proof of concept

This proof of concept evaluates Vitest with Nuxt Test Utils for fast auth-form validation
checks and Playwright for browser-level behavior on the public `/auth` screen.

## Setup and commands

Install repository dependencies, then install the Playwright-managed Chromium build:

```bash
corepack pnpm install
corepack pnpm exec playwright install chromium
```

The test commands are independent:

```bash
corepack pnpm test:unit
corepack pnpm test:unit:watch
corepack pnpm test:e2e
corepack pnpm test:e2e:ui
corepack pnpm test:e2e:debug
corepack pnpm test:check
```

`test:check` is the combined local check. The Playwright command starts a minimal local Nuxt
fixture on port 3100 that mounts the repository's real auth page without loading production
server routes or middleware. Browser routing intercepts every `/api/auth/**` request used by
the scenarios, so the tests use no database, email service, customer data, or external auth
provider. Test addresses use the reserved `example.test` domain.

## Coverage split

Vitest covers the stable schema decisions behind the auth screen: valid and malformed email
addresses, the pre-OTP phase, and complete versus incomplete six-position OTP input.
Playwright contains exactly two scenarios: a valid email submission that reaches the OTP
step, and a malformed email that remains local and sends no OTP request. Browser locators
use visible roles, labels, and text.

## Repeatability, artifacts, and limitations

The unit and browser suites are intentionally small and deterministic for repeat local runs.
On the PoC workstation, two consecutive four-test Vitest runs passed in 8.19 and 8.09
seconds. Two consecutive two-test Playwright runs passed in 24.8 and 21.0 seconds including
local server startup; the warmer repeat was faster. Playwright retains a trace and screenshot
only when a test fails; its report and all test artifacts are ignored by Git. Vitest coverage
output is also ignored.

This PoC does not test real OTP delivery, database-backed session behavior, successful OTP
verification, or protected routes. Those integrations need a separate disposable test
environment with explicit provider and database isolation.

## Recommendation

**Adopt with revision.** Keep Vitest for deterministic validation and composable logic, and
Playwright for a small set of critical browser flows. Before expanding coverage, add a
shared typed auth mock and a deliberately provisioned disposable integration environment;
do not point either suite at production services or externally supplied databases.

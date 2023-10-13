import { test } from 'vitest'

import type { ApiTestContext } from 'fixtures/api.js'
import { render, screen } from 'fixtures/react.js'

import { DeviceDetails } from './DeviceDetails.js'

test<ApiTestContext>('DeviceDetails', async (ctx) => {
  render(<DeviceDetails deviceId='device1' />, ctx)
  await screen.findByText('Front Door')
})

import { test } from 'vitest'

import type { ApiTestContext } from 'fixtures/api.js'
import { render, screen } from 'fixtures/react.js'

import { SupportedDeviceTable } from './SupportedDeviceTable.js'

test<ApiTestContext>('SupportedDeviceTable', async (ctx) => {
  render(<SupportedDeviceTable />, ctx)
  await screen.findByText('Smart Lock')
})

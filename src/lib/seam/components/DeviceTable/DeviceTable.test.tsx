import { test } from 'vitest'

import type { ApiTestContext } from 'fixtures/api.js'
import { render, screen } from 'fixtures/react.js'

import { DeviceTable } from './DeviceTable.js'

test<ApiTestContext>('DeviceTable', async (ctx) => {
  render(<DeviceTable />, ctx)
  await screen.findByText('Fake August Lock 1')
})

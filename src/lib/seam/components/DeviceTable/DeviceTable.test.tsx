import { test } from 'vitest'

import { render, screen } from 'fixtures/react.js'

import { DeviceTable } from './DeviceTable.js'

test('DeviceTable', async () => {
  render(<DeviceTable />)
  await screen.findByText('Front Door')
})

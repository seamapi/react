import { test } from 'vitest'

import type { ApiTestContext } from 'fixtures/api.js'
import { render, screen } from 'fixtures/react.js'

import { DeviceTable } from './DeviceTable.js'

test<ApiTestContext>('DeviceTable renders devices', async (ctx) => {
  render(<DeviceTable />, ctx)
  await screen.findByText('Fake August Lock 1')
})

test<ApiTestContext>('DeviceTable renders generic lock device', async (ctx) => {
  const existingDevice = ctx.database.devices[0]

  ctx.database.addDevice({
    device_id: 'august_generic_lock_device',
    device_type: 'august_lock',
    name: 'Generic August Device',
    display_name: 'Generic August Device',
    connected_account_id: existingDevice?.connected_account_id,
    can_remotely_unlock: false,
    can_remotely_lock: false,
    can_program_online_access_codes: true,
    properties: {
      online: false,
      manufacturer: 'august',
      name: 'Generic August Device',
    },
    workspace_id: existingDevice?.workspace_id ?? '',
    errors: [],
    warnings: [],
    custom_metadata: {},
  })

  render(<DeviceTable />, ctx)
  await screen.findByText('Generic August Device')
})

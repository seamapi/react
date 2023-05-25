import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import {
  type DeviceFilter,
  DeviceHealthBar,
} from 'lib/ui/DeviceTable/DeviceHealthBar.js'

const meta: Meta<typeof DeviceHealthBar> = {
  title: 'Library/DeviceHealthBar',
  component: DeviceHealthBar,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DeviceHealthBar>

export const Content: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [filter, setFilter] = useState<DeviceFilter | null>(null)
    return (
      <Box display='grid' gap={3} gridTemplateColumns='1fr'>
        <DeviceHealthBar filter={null} onSelectFilter={() => {}} devices={[]} />

        <DeviceHealthBar
          filter={filter}
          onSelectFilter={setFilter}
          devices={[
            {
              connected_account_id: 'account_1',
              device_type: 'august_lock',
              device_id: 'dev_1',
              capabilities_supported: [],
              created_at: Date.now().valueOf().toString(),
              workspace_id: 'workspace_1',
              properties: {
                name: 'mydevice',
                online: true,
              },
              errors: [
                {
                  error_code: 'account_disconnected',
                  message: 'Device account has been disconnected.',
                },
              ],
              warnings: [
                {
                  warning_code: 'salto_office_mode',
                  message:
                    'Salto office mode is enabled. Access codes will not unlock doors. You can disable office mode in the Salto dashboard.',
                },
              ],
            },

            {
              connected_account_id: 'account_1',
              device_type: 'august_lock',
              device_id: 'dev_2',
              capabilities_supported: [],
              created_at: Date.now().valueOf().toString(),
              workspace_id: 'workspace_1',
              properties: {
                name: 'mydevice',
                online: true,
              },
              errors: [
                {
                  error_code: 'account_disconnected',
                  message: 'Device account has been disconnected.',
                },
              ],
              warnings: [
                {
                  warning_code: 'salto_office_mode',
                  message:
                    'Salto office mode is enabled. Access codes will not unlock doors. You can disable office mode in the Salto dashboard.',
                },
              ],
            },
          ]}
        />
      </Box>
    )
  },
}

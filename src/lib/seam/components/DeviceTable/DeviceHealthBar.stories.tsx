import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import {
  type AccountFilter,
  type DeviceFilter,
  DeviceHealthBar,
} from 'lib/seam/components/DeviceTable/DeviceHealthBar.js'

const meta: Meta<typeof DeviceHealthBar> = {
  title: 'Library/DeviceHealthBar',
  component: DeviceHealthBar,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Seam-Components?type=design&node-id=521-101011&mode=design&t=4OQwfRB8Mw8kT1rw-4',
    },
  },
}

export default meta

type Story = StoryObj<typeof DeviceHealthBar>

export const Content: Story = {
  render: () => {
    const [filter, setFilter] = useState<AccountFilter | DeviceFilter | null>(
      null
    )
    return (
      <Box display='grid' gap={3} gridTemplateColumns='1fr'>
        <DeviceHealthBar
          filter={null}
          onFilterSelect={() => {}}
          devices={[]}
          errorFilter={() => true}
        />
        <DeviceHealthBar
          filter={filter}
          onFilterSelect={setFilter}
          devices={[
            {
              connected_account_id: 'account_1',
              device_type: 'august_lock',
              device_id: 'dev_1',
              is_managed: true,
              capabilities_supported: [],
              created_at: '2023-05-08T22:38:30.963Z',
              workspace_id: 'workspace_1',
              properties: {
                name: 'mydevice',
                online: true,
                model: {
                  display_name: 'Pro Lock 9000',
                  manufacturer_display_name: 'August',
                },
              },
              errors: [
                {
                  error_code: 'account_disconnected',
                  message: 'Device account has been disconnected.',
                  is_connected_account_error: true,
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
              is_managed: true,
              capabilities_supported: [],
              created_at: '2023-05-08T22:38:30.963Z',
              workspace_id: 'workspace_1',
              properties: {
                name: 'mydevice',
                online: false,
                model: {
                  display_name: 'Smart Lock 2nd Generation',
                  manufacturer_display_name: 'August',
                },
              },
              errors: [
                {
                  error_code: 'device_disconnected',
                  message: 'Device has been disconnected.',
                  is_device_error: true,
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
          errorFilter={() => true}
        />
      </Box>
    )
  },
}

import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import {
  type AccessCodeFilter,
  AccessCodeHealthBar,
} from 'lib/seam/components/AccessCodeTable/AccessCodeHealthBar.js'

const meta: Meta<typeof AccessCodeHealthBar> = {
  title: 'Library/AccessCodeHealthBar',
  component: AccessCodeHealthBar,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AccessCodeHealthBar>

export const Content: Story = {
  render: () => {
    const [filter, setFilter] = useState<AccessCodeFilter | null>(null)
    return (
      <Box display='grid' gap={3} gridTemplateColumns='1fr'>
        <AccessCodeHealthBar
          filter={null}
          onFilterSelect={() => {}}
          accessCodes={[]}
          errorFilter={() => true}
          warningFilter={() => true}
        />
        <AccessCodeHealthBar
          filter={filter}
          onFilterSelect={setFilter}
          accessCodes={[
            {
              device_id: 'device_1',
              name: 'Code 1',
              access_code_id: 'code_1',
              created_at: '2023-05-08T22:38:30.963Z',
              type: 'ongoing',
              code: '1234',
              status: 'setting',
              is_managed: true,
              is_one_time_use: false,
              is_offline_access_code: false,
              is_backup: false,
              is_backup_access_code_available: false,
              common_code_key: null,
              is_external_modification_allowed: false,
              errors: [
                {
                  error_code: 'account_disconnected',
                  is_connected_account_error: true,
                  message:
                    'Account Disconnected, you may need to reconnect the account with a new webview.',
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
              device_id: 'device_1',
              name: 'Code 2',
              access_code_id: 'code_2',
              created_at: '2023-05-08T22:38:30.963Z',
              type: 'ongoing',
              code: '1234',
              status: 'setting',
              is_backup_access_code_available: false,
              is_managed: true,
              is_one_time_use: false,
              is_offline_access_code: false,
              is_backup: false,
              common_code_key: null,
              is_external_modification_allowed: false,
              errors: [
                {
                  error_code: 'account_disconnected',
                  is_connected_account_error: true,
                  message:
                    'Account Disconnected, you may need to reconnect the account with a new webview.',
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
          warningFilter={() => true}
        />
      </Box>
    )
  },
}

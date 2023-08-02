import { Box } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { ClimateSettingStatus } from './ClimateSettingStatus.js'

const meta: Meta<typeof ClimateSettingStatus> = {
  title: 'Library/ClimateSettingStatus',
  tags: ['autodocs'],
  component: ClimateSettingStatus,
}

type Story = StoryObj<typeof ClimateSettingStatus>

export const Content: Story = {
  render: () => {
    return (
      <Box display='grid' gap={4} gridTemplateColumns='repeat(2, min-content)'>
        <ClimateSettingStatus
          setting={{
            hvac_mode_setting: 'cool',
            cooling_set_point_fahrenheit: 70,
            manual_override_allowed: true,
          }}
        />

        <ClimateSettingStatus
          setting={{
            hvac_mode_setting: 'cool',
            cooling_set_point_fahrenheit: 70,
            manual_override_allowed: true,
          }}
          iconPlacement='right'
        />

        <ClimateSettingStatus
          setting={{
            hvac_mode_setting: 'heat',
            heating_set_point_fahrenheit: 70,
            manual_override_allowed: true,
          }}
        />
        <ClimateSettingStatus
          setting={{
            hvac_mode_setting: 'heat',
            heating_set_point_fahrenheit: 70,
            manual_override_allowed: true,
          }}
          iconPlacement='right'
        />

        <ClimateSettingStatus
          setting={{
            hvac_mode_setting: 'heatcool',
            cooling_set_point_fahrenheit: 70,
            heating_set_point_fahrenheit: 60,
            manual_override_allowed: true,
          }}
        />

        <ClimateSettingStatus
          setting={{
            hvac_mode_setting: 'heatcool',
            cooling_set_point_fahrenheit: 70,
            heating_set_point_fahrenheit: 60,
            manual_override_allowed: true,
          }}
          iconPlacement='right'
        />

        <ClimateSettingStatus
          setting={{
            hvac_mode_setting: 'off',
            manual_override_allowed: false,
          }}
        />

        <ClimateSettingStatus
          setting={{
            hvac_mode_setting: 'off',
            manual_override_allowed: false,
          }}
          iconPlacement='right'
        />
      </Box>
    )
  },
}

export default meta

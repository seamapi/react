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
      <Box display='grid' gap={4} gridTemplateColumns='repeat(4, min-content)'>
        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'cool',
            cooling_set_point_fahrenheit: 70,
            cooling_set_point_celsius: 21,
            manual_override_allowed: true,
          }}
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'cool',
            cooling_set_point_fahrenheit: 70,
            cooling_set_point_celsius: 21,
            manual_override_allowed: true,
          }}
          iconPlacement='right'
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'cool',
            cooling_set_point_fahrenheit: 70,
            cooling_set_point_celsius: 21,
            manual_override_allowed: true,
          }}
          temperatureUnit='celsius'
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'cool',
            cooling_set_point_fahrenheit: 70,
            cooling_set_point_celsius: 21,
            manual_override_allowed: true,
          }}
          iconPlacement='right'
          temperatureUnit='celsius'
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'heat',
            heating_set_point_fahrenheit: 70,
            heating_set_point_celsius: 21,
            manual_override_allowed: true,
          }}
        />
        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'heat',
            heating_set_point_fahrenheit: 70,
            heating_set_point_celsius: 21,
            manual_override_allowed: true,
          }}
          iconPlacement='right'
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'heat',
            heating_set_point_fahrenheit: 70,
            heating_set_point_celsius: 21,
            manual_override_allowed: true,
          }}
          temperatureUnit='celsius'
        />
        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'heat',
            heating_set_point_fahrenheit: 70,
            heating_set_point_celsius: 21,
            manual_override_allowed: true,
          }}
          iconPlacement='right'
          temperatureUnit='celsius'
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'heatcool',
            cooling_set_point_fahrenheit: 70,
            cooling_set_point_celsius: 21,
            heating_set_point_fahrenheit: 60,
            heating_set_point_celsius: 15,
            manual_override_allowed: true,
          }}
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'heatcool',
            cooling_set_point_fahrenheit: 70,
            cooling_set_point_celsius: 21,
            heating_set_point_fahrenheit: 60,
            heating_set_point_celsius: 15,
            manual_override_allowed: true,
          }}
          iconPlacement='right'
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'heatcool',
            cooling_set_point_fahrenheit: 70,
            cooling_set_point_celsius: 21,
            heating_set_point_fahrenheit: 60,
            heating_set_point_celsius: 15,
            manual_override_allowed: true,
          }}
          temperatureUnit='celsius'
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'heatcool',
            cooling_set_point_fahrenheit: 70,
            cooling_set_point_celsius: 21,
            heating_set_point_fahrenheit: 60,
            heating_set_point_celsius: 15,
            manual_override_allowed: true,
          }}
          iconPlacement='right'
          temperatureUnit='celsius'
        />

        <ClimateSettingStatus
          climateSetting={{
            hvac_mode_setting: 'off',
            manual_override_allowed: false,
          }}
        />

        <ClimateSettingStatus
          climateSetting={{
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

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
  render: (props) => {
    return (
      <Box display='grid' gap={3} gridTemplateColumns='repeat(3, min-content)'>
        <div>
          <ClimateSettingStatus
            setting={{
              hvac_mode_setting: 'cool',
              cooling_set_point_fahrenheit: 70,
              manual_override_allowed: true,
            }}
          />
        </div>
      </Box>
    )
  },
}

export default meta

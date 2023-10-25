import { Box } from '@mui/material'
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { ClimateSettingControlGroup } from './ClimateSettingControlGroup.js'

const meta: Meta<typeof ClimateSettingControlGroup> = {
  title: 'Library/ClimateSettingControlGroup',
  tags: ['autodocs'],
  component: ClimateSettingControlGroup,
  args: {
    mode: 'heat_cool',
    heatValue: 75,
    coolValue: 80,
    minHeat: 70,
    maxHeat: 100,
    minCool: 50,
    maxCool: 90,
    delta: 5,
  },
  argTypes: {
    mode: {
      control: {
        type: 'select',
        options: ['heat', 'cool', 'heat_cool', 'off'],
      },
    },
    heatValue: {
      control: {
        type: 'number',
      },
    },
    coolValue: {
      control: {
        type: 'number',
      },
    },
    minHeat: {
      control: {
        type: 'number',
      },
    },
    maxHeat: {
      control: {
        type: 'number',
      },
    },
    minCool: {
      control: {
        type: 'number',
      },
    },
    maxCool: {
      control: {
        type: 'number',
      },
    },
    delta: {
      control: {
        type: 'number',
      },
    },
  },
}

type Story = StoryObj<typeof ClimateSettingControlGroup>

export const Content: Story = {
  render: (props) => {
    const [_, setArgs] = useArgs()

    return (
      <Box>
        <ClimateSettingControlGroup
          mode={props.mode ?? 'heat_cool'}
          onModeChange={(m) => {
            setArgs({ mode: m })
          }}
          heatValue={props.heatValue}
          onHeatValueChange={(t) => {
            setArgs({ heatValue: t })
          }}
          coolValue={props.coolValue}
          onCoolValueChange={(t) => {
            setArgs({ coolValue: t })
          }}
          minHeat={props.minHeat}
          maxHeat={props.maxHeat}
          minCool={props.minCool}
          maxCool={props.maxCool}
          delta={props.delta}
        />
      </Box>
    )
  },
}

export default meta

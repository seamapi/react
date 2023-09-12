import { Box } from '@mui/material'
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { TemperatureControlGroup } from './TemperatureControlGroup.js'

const meta: Meta<typeof TemperatureControlGroup> = {
  title: 'Library/TemperatureControlGroup',
  tags: ['autodocs'],
  component: TemperatureControlGroup,
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
        options: ['heat', 'cool', 'heat_cool'],
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

type Story = StoryObj<typeof TemperatureControlGroup>

export const Content: Story = {
  render: (props) => {
    const [_, setArgs] = useArgs()

    return (
      <Box>
        <TemperatureControlGroup
          mode={props.mode ?? 'heat_cool'}
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

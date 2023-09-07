import { Box } from '@mui/material'
import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/react'

import { TemperatureControlGroup } from './TemperatureControlGroup.js'

const meta: Meta<typeof TemperatureControlGroup> = {
  title: 'Library/TemperatureControlGroup',
  tags: ['autodocs'],
  component: TemperatureControlGroup,
}

type Story = StoryObj<typeof TemperatureControlGroup>

export const Content: Story = {
  render: (props) => {
    const [_, setArgs] = useArgs()

    return (
      <Box
        sx={{
          gap: '64px !important',

          '&, & > div': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: '24px',
          },
        }}
      >
        <TemperatureControlGroup
          mode={props.mode ?? 'heat_cool'}
          heatValue={props.heatValue ?? 75}
          onHeatValueChange={(t) => {
            setArgs({ heatValue: t })
          }}
          coolValue={props.coolValue ?? 80}
          onCoolValueChange={(t) => {
            setArgs({ coolValue: t })
          }}
          minHeat={props.minHeat ?? 70}
          maxHeat={props.maxHeat ?? 100}
          minCool={props.minCool ?? 50}
          maxCool={props.maxCool ?? 90}
          delta={props.delta ?? 5}
        />

        {/* <div>
          <p>Same range; delta = 5</p>
          <TemperatureControlGroup
            mode='heatcool'
            minHeat={60}
            maxHeat={90}
            minCool={60}
            maxCool={90}
          />
        </div>

        <TemperatureControlGroup mode='heat' />
        <TemperatureControlGroup mode='cool' /> */}
      </Box>
    )
  },
}

export default meta

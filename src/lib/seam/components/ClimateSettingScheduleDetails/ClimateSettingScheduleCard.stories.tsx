import type { Meta, StoryObj } from '@storybook/react'

import { ClimateSettingScheduleCard } from './ClimateSettingScheduleCard.js'

const meta: Meta<typeof ClimateSettingScheduleCard> = {
  title: 'Library/ClimateSettingScheduleCard',
  tags: ['autodocs'],
  component: ClimateSettingScheduleCard,
}

type Story = StoryObj<typeof ClimateSettingScheduleCard>

export const Content: Story = {
  render: (props) => (
    <ClimateSettingScheduleCard
      {...props}
      climateSettingScheduleId={
        props.climateSettingScheduleId ?? 'climate_setting_schedule1'
      }
    />
  ),
}

export default meta

import { render, screen } from 'fixtures/react.js'

import { ClimateSettingScheduleTable } from './ClimateSettingScheduleTable.js'

test('ClimateSettingScheduleTable', async () => {
  render(<ClimateSettingScheduleTable />)
  await screen.findByText('Front Door')
})

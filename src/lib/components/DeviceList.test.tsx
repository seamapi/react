import { render, screen } from 'fixtures/react.js'

import { DeviceList } from './DeviceList.js'

test('DeviceList', () => {
  expect(DeviceList).toBeTruthy()
  render(<DeviceList />)
  expect(screen.getByRole('loading')).toBeTruthy()
})

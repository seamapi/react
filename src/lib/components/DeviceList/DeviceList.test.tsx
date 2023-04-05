import { render, screen } from 'fixtures/react.js'

import { DeviceList } from './DeviceList.js'

test('DeviceList', () => {
  render(<DeviceList />)
  expect(screen.getByRole('loading')).toBeTruthy()
})

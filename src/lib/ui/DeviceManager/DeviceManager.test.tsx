import { DeviceManager } from './DeviceManager.js'

import { render, screen } from 'fixtures/react.js'

test('DeviceManager', () => {
  render(<DeviceManager />)
  expect(screen.findByRole('loading')).toBeTruthy()
})

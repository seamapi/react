import { render, screen } from 'fixtures/react.js'

import { DeviceManager } from './DeviceManager.js'

test('DeviceManager', () => {
  render(<DeviceManager />)
  expect(screen.findByRole('loading')).toBeTruthy()
})

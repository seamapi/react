import { render, screen } from 'fixtures/react.js'

import { DeviceManager } from './index.js'

test('DeviceManager', () => {
  render(<DeviceManager />)
  expect(screen.findByRole('loading')).toBeTruthy()
})

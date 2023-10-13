import { render, screen } from '@testing-library/react'
import { test } from 'vitest'

test('render', async () => {
  render(<p>Foo</p>)
  await screen.findByText('Foo')
})

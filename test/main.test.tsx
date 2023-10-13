import { test } from 'vitest'

import type { ApiTestContext } from 'fixtures/api.js'
import { render, screen } from 'fixtures/react.js'

test<ApiTestContext>('render', async (ctx) => {
  render(<p>Foo</p>, ctx)
  await screen.findByText('Foo')
})

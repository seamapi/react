import { screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import {
  type EcosystemTestContext,
  renderWithEcosystem,
  setupFakeEcosystem,
} from 'fixtures/ecosystem.js'

import { AccessoryCatalog, AccessoryLinks } from './AccessoryCatalog.js'

setupFakeEcosystem()

test<EcosystemTestContext>('accessory lookups are batched by slug across manufacturers and use canonical device routes', async (ctx) => {
  renderWithEcosystem(
    <AccessoryCatalog
      slugs={['engage-gateway', 'august-connect-wifi-bridge', 'engage-gateway']}
    >
      <AccessoryLinks
        message='A compatible bridge is required.'
        slugs={['engage-gateway']}
      />
      <AccessoryLinks
        message='A compatible bridge is required.'
        slugs={['august-connect-wifi-bridge']}
      />
    </AccessoryCatalog>,
    ctx
  )
  const gateway = await screen.findByRole('link', { name: /Engage Gateway/ })
  const bridge = await screen.findByRole('link', {
    name: /Connect Wi-Fi Bridge/,
  })
  expect(gateway.getAttribute('href')).toBe(
    'https://www.seam.co/gateways/schlage_engage-gateway'
  )
  expect(bridge.getAttribute('href')).toBe(
    'https://www.seam.co/bridges/august_august-connect-wifi-bridge'
  )
  expect(ctx.ecosystemRequestUrls).toHaveLength(1)
  const request = ctx.ecosystemRequestUrls[0]
  expect(request?.searchParams.get('slugs')).toBe(
    'august-connect-wifi-bridge,engage-gateway'
  )
  expect(request?.searchParams.has('manufacturer')).toBe(false)
  expect(request?.searchParams.has('provider')).toBe(false)
})

test<EcosystemTestContext>('missing accessory records stay explicit while known accessories remain linked', async (ctx) => {
  renderWithEcosystem(
    <AccessoryCatalog slugs={['engage-gateway', 'missing']}>
      <AccessoryLinks
        message='A compatible bridge is required.'
        slugs={['engage-gateway', 'missing']}
      />
    </AccessoryCatalog>,
    ctx
  )
  await screen.findByRole('link', { name: /Engage Gateway/ })
  await screen.findByText('Some accessory details couldn’t be loaded.')
  expect(screen.queryByRole('link', { name: /missing/ })).toBeNull()
})

test<EcosystemTestContext>('requirements without accessory relations do not fetch an unfiltered catalog', (ctx) => {
  renderWithEcosystem(
    <AccessoryCatalog slugs={[]}>
      <AccessoryLinks message='An external keypad is required.' />
    </AccessoryCatalog>,
    ctx
  )
  expect(ctx.ecosystemRequests).toEqual([])
  expect(screen.queryByText('Compatible keypads')).toBeNull()
})

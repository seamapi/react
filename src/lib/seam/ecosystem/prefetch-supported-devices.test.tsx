// @vitest-environment node
import { renderToString } from 'react-dom/server'
import { expect, test } from 'vitest'

import {
  type EcosystemTestContext,
  fakeInvalidEmbedKey,
  fakeManufacturerEmbedKey,
  fakePartnerEmbedKey,
  fakeWrongOriginEmbedKey,
  setupFakeEcosystem,
} from 'fixtures/ecosystem.js'
import { SupportedDevices } from 'lib/seam/components/SupportedDevices/SupportedDevices.js'

import { EcosystemProvider } from './EcosystemProvider.js'
import { prefetchSupportedDevices } from './prefetch-supported-devices.js'
import type { DeviceModelSummariesListResponse } from './types.js'

setupFakeEcosystem()

test<EcosystemTestContext>('server HTML contains the populated catalog, hardware, providers and requirements without a browser', async (ctx) => {
  expect(typeof window).toBe('undefined')
  const dehydratedState = await prefetchSupportedDevices({
    ecosystemEndpoint: ctx.ecosystemEndpoint,
    manufacturer: 'schlage',
    deviceType: 'smartlock',
  })
  const requests = ctx.ecosystemRequests.length
  const html = renderToString(
    <EcosystemProvider
      ecosystemEndpoint={ctx.ecosystemEndpoint}
      dehydratedState={dehydratedState}
    >
      <SupportedDevices manufacturer='schlage' deviceType='smartlock' />
    </EcosystemProvider>
  )
  for (const content of [
    'Encode Plus Smart WiFi Deadbolt',
    'BE499WB',
    'Schlage Home',
    'Remote unlock',
    'Access codes',
    'Requirements',
    'Requires a SmartThings hub.',
    'BE469ZP',
  ]) {
    expect(html).toContain(content)
  }
  expect(html).toContain('<details')
  expect(html).not.toContain('Loading supported devices')
  expect(html).not.toContain('Loading accessories')
  expect(ctx.ecosystemRequests).toHaveLength(requests)
})

test<EcosystemTestContext>('server prefetch includes linked accessory records in the initial HTML', async (ctx) => {
  const fetch: typeof globalThis.fetch = async (input, init) => {
    const response = await globalThis.fetch(input, init)
    const url = new URL(String(input))
    if (
      !url.pathname.endsWith('device_models/summaries/list') ||
      url.searchParams.has('slugs')
    )
      return response
    const data = (await response.json()) as DeviceModelSummariesListResponse
    for (const model of data.device_models) {
      for (const entry of model.capabilities_by_provider) {
        for (const capability of entry.capabilities) {
          if (capability.name !== 'can_program_online_access_codes') continue
          capability.supported = 'conditionally'
          capability.report = {
            details: 'An external keypad is required.',
            requirements: {
              accessory: {
                message: 'An external keypad is required.',
                device_slugs: ['august-connect-wifi-bridge'],
              },
            },
          }
        }
      }
    }
    return new Response(JSON.stringify(data))
  }
  const dehydratedState = await prefetchSupportedDevices({
    ecosystemEndpoint: ctx.ecosystemEndpoint,
    manufacturer: 'august',
    fetch,
  })
  const html = renderToString(
    <EcosystemProvider
      ecosystemEndpoint={ctx.ecosystemEndpoint}
      dehydratedState={dehydratedState}
    >
      <SupportedDevices manufacturer='august' />
    </EcosystemProvider>
  )
  expect(html).toContain(
    'https://www.seam.co/bridges/august_august-connect-wifi-bridge'
  )
  expect(html).toContain('An external keypad is required.')
  expect(html).not.toContain('Loading accessories')
  expect(
    ctx.ecosystemRequestUrls.some(
      (url) =>
        url.searchParams.has('slugs') && url.pathname.endsWith('summaries/list')
    )
  ).toBe(true)
})

test<EcosystemTestContext>('manufacturer keys hydrate their default scope and validate the configured page origin on every fetch', async (ctx) => {
  const origins: Array<string | null> = []
  const dehydratedState = await prefetchSupportedDevices({
    ecosystemEndpoint: ctx.ecosystemEndpoint,
    embedKey: ` ${fakeManufacturerEmbedKey} `,
    origin: 'https://example.com',
    fetch: async (input, init) => {
      origins.push(new Headers(init?.headers).get('Origin'))
      return await globalThis.fetch(input, init)
    },
  })
  const html = renderToString(
    <EcosystemProvider
      ecosystemEndpoint={ctx.ecosystemEndpoint}
      embedKey={fakeManufacturerEmbedKey}
      dehydratedState={dehydratedState}
    >
      <SupportedDevices />
    </EcosystemProvider>
  )
  expect(html).toContain('Supported Schlage devices')
  expect(html).not.toContain('Smart Lock Pro')
  expect(origins.length).toBeGreaterThan(0)
  expect(origins.every((origin) => origin === 'https://example.com')).toBe(true)
})

test<EcosystemTestContext>('partner exclusions remove unsupported devices and providers from serialized data', async (ctx) => {
  const state = await prefetchSupportedDevices({
    ecosystemEndpoint: ctx.ecosystemEndpoint,
    embedKey: fakePartnerEmbedKey,
    origin: 'https://example.com',
  })
  const serialized = JSON.stringify(state)
  expect(serialized).not.toContain('Smart Lock Pro')
  expect(serialized).not.toContain('August Access')
  expect(serialized).not.toContain('Connect Smart Deadbolt')
  expect(serialized).toContain('Encode Plus Smart WiFi Deadbolt')
})

test<EcosystemTestContext>('separate server requests do not share query data', async (ctx) => {
  const [august, schlage] = await Promise.all(
    ['august', 'schlage'].map(
      async (manufacturer) =>
        await prefetchSupportedDevices({
          ecosystemEndpoint: ctx.ecosystemEndpoint,
          manufacturer,
        })
    )
  )
  expect(JSON.stringify(august)).toContain('Smart Lock Pro')
  expect(JSON.stringify(august)).not.toContain(
    'Encode Plus Smart WiFi Deadbolt'
  )
  expect(JSON.stringify(schlage)).toContain('Encode Plus Smart WiFi Deadbolt')
  expect(JSON.stringify(schlage)).not.toContain('Smart Lock Pro')
})

test<EcosystemTestContext>('missing origin, invalid keys and disallowed origins fail before rendering', async (ctx) => {
  await expect(
    prefetchSupportedDevices({
      ecosystemEndpoint: ctx.ecosystemEndpoint,
      embedKey: fakeManufacturerEmbedKey,
    })
  ).rejects.toThrow('page origin')
  for (const embedKey of [fakeInvalidEmbedKey, fakeWrongOriginEmbedKey]) {
    await expect(
      prefetchSupportedDevices({
        ecosystemEndpoint: ctx.ecosystemEndpoint,
        embedKey,
        origin: 'https://example.com',
      })
    ).rejects.toMatchObject({
      status: embedKey === fakeInvalidEmbedKey ? 401 : 403,
    })
  }
})

test<EcosystemTestContext>('broken pagination rejects rather than generating a partial catalog page', async (ctx) => {
  await expect(
    prefetchSupportedDevices({
      ecosystemEndpoint: ctx.ecosystemEndpoint,
      manufacturer: 'schlage',
      fetch: async (input, init) => {
        const response = await globalThis.fetch(input, init)
        if (!String(input).includes('summaries/list')) return response
        const data = (await response.json()) as DeviceModelSummariesListResponse
        data.pagination = { has_next_page: true, next_page_cursor: null }
        return new Response(JSON.stringify(data))
      },
    })
  ).rejects.toMatchObject({ type: 'pagination_incomplete' })
})

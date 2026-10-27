import { fireEvent, screen, within } from '@testing-library/react'
import { expect, test, vi } from 'vitest'

import {
  type EcosystemTestContext,
  fakeEmbedKey,
  fakeInvalidEmbedKey,
  fakeManufacturerEmbedKey,
  fakePartnerEmbedKey,
  renderWithEcosystem,
  setupFakeEcosystem,
} from 'fixtures/ecosystem.js'

import { SupportedDevices } from './SupportedDevices.js'

setupFakeEcosystem()

test<EcosystemTestContext>('SupportedDevices follows every catalog page', async (ctx) => {
  const fetch = globalThis.fetch
  const fetchSpy = vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async (input, init) => {
      const response = await fetch(input, init)
      const url = new URL(String(input))
      if (
        !url.pathname.endsWith('device_models/summaries/list') ||
        url.searchParams.has('page_cursor')
      )
        return response
      const data = await response.json()
      data.device_models = data.device_models.slice(0, 2)
      data.pagination = {
        has_next_page: true,
        next_page_cursor: data.device_models[1].slug,
      }
      return new Response(JSON.stringify(data), { status: 200 })
    })
  try {
    renderWithEcosystem(<SupportedDevices manufacturer='schlage' />, ctx)
    await screen.findByText('7 devices')
    expect(
      ctx.ecosystemRequestUrls.filter((url) =>
        url.pathname.endsWith('device_models/summaries/list')
      )
    ).toHaveLength(2)
  } finally {
    fetchSpy.mockRestore()
  }
})

const getSectionTitles = (): string[] =>
  screen
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent ?? '')

test<EcosystemTestContext>('SupportedDevices groups device models by manufacturer', async (ctx) => {
  renderWithEcosystem(<SupportedDevices />, ctx)
  await screen.findByText('Encode Plus Smart WiFi Deadbolt')
  screen.getByRole('heading', { name: 'Supported devices' })
  expect(getSectionTitles()).toEqual([
    '2N',
    'August',
    'ecobee',
    'Google Nest',
    'Honeywell',
    'igloohome',
    'Minut',
    'NoiseAware',
    'Salto',
    'Schlage',
    'Yale',
  ])
  expect(screen.queryByText('Internal Test Lock')).toBeNull()
  screen.getByRole('button', { name: 'Show all 7 Schlage devices' })
})

test<EcosystemTestContext>('SupportedDevices loads the slim device model summaries', async (ctx) => {
  renderWithEcosystem(<SupportedDevices manufacturer='schlage' />, ctx)
  await screen.findByText('Control Smart Lock')
  expect(ctx.ecosystemRequests).toContain('GET v1/device_models/summaries/list')
  expect(ctx.ecosystemRequests).not.toContain('GET v1/device_models/list')
})

test<EcosystemTestContext>('SupportedDevices shows one manufacturer', async (ctx) => {
  renderWithEcosystem(<SupportedDevices manufacturer='schlage' />, ctx)
  await screen.findByText('Control Smart Lock')
  screen.getByRole('heading', { name: 'Supported Schlage devices' })
  expect(getSectionTitles()).toEqual(['Schlage'])
  expect(screen.queryByRole('combobox', { name: 'Manufacturer' })).toBeNull()
  expect(screen.queryByRole('button', { name: /Show all/ })).toBeNull()
  screen.getByText('Engage Gateway')
})

test<EcosystemTestContext>('SupportedDevices scopes the query and badges to a provider', async (ctx) => {
  renderWithEcosystem(
    <SupportedDevices manufacturer='schlage' provider='schlage-engage' />,
    ctx
  )
  await screen.findByText('Control Smart Lock')
  expect(screen.queryByText('Encode Plus Smart WiFi Deadbolt')).toBeNull()
  expect(screen.queryByText(/via Schlage Home/)).toBeNull()
  screen.getByText('Engage Gateway')
  const request = ctx.ecosystemRequestUrls.find((url) =>
    url.pathname.endsWith('device_models/summaries/list')
  )
  expect(request?.searchParams.get('provider')).toBe('schlage-engage')
})

test<EcosystemTestContext>('conditional requirements are readable without hovering', async (ctx) => {
  renderWithEcosystem(<SupportedDevices manufacturer='august' />, ctx)
  const name = await screen.findByText('Smart Lock Pro')
  const row = name.closest('li')
  if (row == null) throw new Error('Missing row')
  within(row).getByRole('list', { name: 'Requirements' })
  within(row).getByText(/Requires an August keypad/)
})

test<EcosystemTestContext>('SupportedDevices shows features and keeps identifiers in model details', async (ctx) => {
  renderWithEcosystem(<SupportedDevices manufacturer='schlage' />, ctx)
  const name = await screen.findByText('Encode Plus Smart WiFi Deadbolt')
  const row = name.closest('li')
  if (row == null) throw new Error('Missing row')
  const badges = within(row).getByRole('list', {
    name: 'Supported features',
  })
  expect(
    within(badges)
      .getAllByRole('listitem')
      .map((badge) => badge.textContent)
  ).toEqual(['Remote unlock', 'Remote lock', 'Access codes'])
  const modelNumber = within(row).getByText('BE499WB')
  const details = modelNumber.closest('details')
  expect(details?.hasAttribute('open')).toBe(false)
  expect(within(row).getByText('Schlage Home').closest('details')).toBe(details)
  expect(within(row).queryByText(/via Schlage Home/)).toBeNull()
})

test<EcosystemTestContext>('SupportedDevices defaults to the manufacturer of a manufacturer key', async (ctx) => {
  renderWithEcosystem(<SupportedDevices />, {
    ...ctx,
    embedKey: fakeManufacturerEmbedKey,
  })
  await screen.findByText('Control Smart Lock')
  screen.getByRole('heading', { name: 'Supported Schlage devices' })
  expect(getSectionTitles()).toEqual(['Schlage'])
})

test<EcosystemTestContext>('SupportedDevices prefers the manufacturer attribute over the key', async (ctx) => {
  renderWithEcosystem(<SupportedDevices manufacturer='yale' />, {
    ...ctx,
    embedKey: fakeManufacturerEmbedKey,
  })
  await screen.findByText('Assure Lock 2')
  expect(getSectionTitles()).toEqual(['Yale'])
})

test<EcosystemTestContext>("SupportedDevices honors a partner key's exclusions", async (ctx) => {
  renderWithEcosystem(<SupportedDevices deviceType='smartlock' />, {
    ...ctx,
    embedKey: fakePartnerEmbedKey,
  })
  await screen.findByText('Encode Plus Smart WiFi Deadbolt')
  expect(screen.queryByText('Wi-Fi Smart Lock')).toBeNull()
  expect(screen.queryByText('Connect Smart Deadbolt')).toBeNull()
  expect(screen.queryByText('Assure Lock SL (Z-Wave)')).toBeNull()
  screen.getByText('XS4 One')
  expect(getSectionTitles()).not.toContain('August')
})

test<EcosystemTestContext>("SupportedDevices honors a partner key's capability exclusions", async (ctx) => {
  renderWithEcosystem(
    <SupportedDevices
      deviceType='smartlock'
      capability='can_provision_mobile_keys'
    />,
    { ...ctx, embedKey: fakePartnerEmbedKey }
  )
  await screen.findByText('Control Smart Lock')
  expect(screen.queryByText('XS4 One')).toBeNull()
  expect(getSectionTitles()).toEqual(['Schlage'])
})

test<EcosystemTestContext>('SupportedDevices filters by capability', async (ctx) => {
  renderWithEcosystem(
    <SupportedDevices capability='can_provision_mobile_keys' />,
    { ...ctx, embedKey: fakeEmbedKey }
  )
  await screen.findByText('XS4 One')
  expect(getSectionTitles()).toEqual(['Salto', 'Schlage'])
})

test<EcosystemTestContext>('SupportedDevices searches and filters', async (ctx) => {
  renderWithEcosystem(<SupportedDevices />, ctx)
  await screen.findByText('Encode Plus Smart WiFi Deadbolt')

  fireEvent.change(screen.getByRole('combobox', { name: 'Device type' }), {
    target: { value: 'thermostat' },
  })
  await screen.findByText('Nest Thermostat')
  expect(getSectionTitles()).toEqual(['ecobee', 'Google Nest', 'Honeywell'])

  const search = screen.getByRole('searchbox', { name: 'Search devices' })
  fireEvent.change(search, { target: { value: 'nest learning' } })
  await screen.findByText('Nest Learning Thermostat')
  expect(screen.queryByText('Nest Thermostat')).toBeNull()

  fireEvent.change(search, { target: { value: 'nothing matches' } })
  await screen.findByText('No devices match your search or filters.')
  fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
  await screen.findByText('Encode Plus Smart WiFi Deadbolt')
})

test<EcosystemTestContext>('SupportedDevices shows an empty state', async (ctx) => {
  renderWithEcosystem(<SupportedDevices manufacturer='unknown' />, ctx)
  await screen.findByText('No supported devices found.')
})

test<EcosystemTestContext>('SupportedDevices shows an error for an invalid embed key', async (ctx) => {
  renderWithEcosystem(<SupportedDevices />, {
    ...ctx,
    embedKey: fakeInvalidEmbedKey,
  })
  await screen.findByText('The embed key is invalid or has been revoked.')
})

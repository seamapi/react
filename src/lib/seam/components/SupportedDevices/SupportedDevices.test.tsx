import { fireEvent, screen, within } from '@testing-library/react'
import { expect, test } from 'vitest'

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

test<EcosystemTestContext>('SupportedDevices shows device type and capability badges', async (ctx) => {
  renderWithEcosystem(<SupportedDevices manufacturer='schlage' />, ctx)
  const name = await screen.findByText('Encode Plus Smart WiFi Deadbolt')
  const row = name.closest('li')
  if (row == null) throw new Error('Missing row')
  const badges = within(row).getByRole('list', {
    name: 'Device type and capabilities',
  })
  expect(
    within(badges)
      .getAllByRole('listitem')
      .map((badge) => badge.textContent)
  ).toEqual(['Smartlock', 'Remote unlock', 'Remote lock', 'Access codes'])
  within(row).getByText('BE499WB · via Schlage Home')
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

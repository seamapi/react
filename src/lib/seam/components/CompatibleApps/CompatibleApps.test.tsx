import { SeamProvider } from '@seamapi/react'
import { QueryClient } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import type { ApiTestContext } from 'fixtures/api.js'
import {
  type EcosystemTestContext,
  fakeEmbedKey,
  fakeInvalidEmbedKey,
  fakeWrongOriginEmbedKey,
  renderWithEcosystem,
  setupFakeEcosystem,
} from 'fixtures/ecosystem.js'

import { CompatibleApps } from './CompatibleApps.js'

setupFakeEcosystem()

test<EcosystemTestContext>('CompatibleApps lists live partners for a device type', async (ctx) => {
  renderWithEcosystem(<CompatibleApps deviceType='smartlock' />, {
    ...ctx,
    embedKey: fakeEmbedKey,
  })
  await screen.findByText('StayPilot')
  screen.getByText('Works with these apps')
  screen.getByText('Gatehouse')
  expect(screen.queryByText('Lockbox Labs')).toBeNull()
  expect(screen.queryByText('Hearth & Key')).toBeNull()
  const names = screen
    .getAllByRole('listitem')
    .map(
      (item) => item.querySelector('.seam-compatible-apps-name')?.textContent
    )
  expect(names[0]).toBe('StayPilot')
})

test<EcosystemTestContext>('CompatibleApps filters by manufacturer', async (ctx) => {
  renderWithEcosystem(
    <CompatibleApps deviceType='smartlock' manufacturer='schlage' />,
    { ...ctx, embedKey: fakeEmbedKey }
  )
  await screen.findByText('Hearth & Key')
  screen.getByText('Keyturn')
})

test<EcosystemTestContext>('CompatibleApps shows notes for a provider capability', async (ctx) => {
  renderWithEcosystem(
    <CompatibleApps
      deviceType='smartlock'
      provider='salto-ks'
      capability='can_provision_mobile_keys'
    />,
    { ...ctx, embedKey: fakeEmbedKey }
  )
  await screen.findByText(
    'Residents unlock Salto KS doors from the Gatehouse app.'
  )
  expect(screen.queryByText('StayPilot')).toBeNull()
  expect(screen.queryByText('Tenantry')).toBeNull()
})

test<EcosystemTestContext>('CompatibleApps filters by industry', async (ctx) => {
  renderWithEcosystem(
    <CompatibleApps deviceType='thermostat' industry='short-term-rental' />,
    { ...ctx, embedKey: fakeEmbedKey }
  )
  await screen.findByText('ThermoStay')
  expect(screen.queryByText('Brightside Suites')).toBeNull()
})

test<EcosystemTestContext>('CompatibleApps searches partners', async (ctx) => {
  renderWithEcosystem(<CompatibleApps deviceType='smartlock' />, {
    ...ctx,
    embedKey: fakeEmbedKey,
  })
  await screen.findByText('StayPilot')
  const search = screen.getByRole('searchbox', { name: 'Search apps' })
  fireEvent.change(search, { target: { value: 'gate' } })
  await screen.findByText('Gatehouse')
  expect(screen.queryByText('StayPilot')).toBeNull()
  fireEvent.change(search, { target: { value: 'nothing matches' } })
  await screen.findByText('No apps found for "nothing matches".')
  fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
  await screen.findByText('StayPilot')
})

test<EcosystemTestContext>('CompatibleApps shows more partners on request', async (ctx) => {
  renderWithEcosystem(
    <CompatibleApps deviceType='smartlock' maxVisible={3} />,
    {
      ...ctx,
      embedKey: fakeEmbedKey,
    }
  )
  const button = await screen.findByRole('button', { name: 'Show 7 more apps' })
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
  fireEvent.click(button)
  expect(screen.getAllByRole('listitem')).toHaveLength(10)
})

test<EcosystemTestContext>('CompatibleApps shows an empty state', async (ctx) => {
  renderWithEcosystem(<CompatibleApps deviceType='camera' />, {
    ...ctx,
    embedKey: fakeEmbedKey,
  })
  await screen.findByText('No apps are listed for this selection yet.')
})

test<EcosystemTestContext>('CompatibleApps shows an error for an invalid embed key', async (ctx) => {
  renderWithEcosystem(<CompatibleApps deviceType='smartlock' />, {
    ...ctx,
    embedKey: fakeInvalidEmbedKey,
  })
  await screen.findByText('The embed key is invalid or has been revoked.')
  expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
})

test<EcosystemTestContext>('CompatibleApps shows an error for a missing embed key', async (ctx) => {
  renderWithEcosystem(<CompatibleApps deviceType='smartlock' />, ctx)
  await screen.findByText(
    'An embed key is required to show this list on this website.'
  )
})

test<EcosystemTestContext>('CompatibleApps shows an error for a disallowed origin', async (ctx) => {
  renderWithEcosystem(<CompatibleApps deviceType='smartlock' />, {
    ...ctx,
    embedKey: fakeWrongOriginEmbedKey,
  })
  await screen.findByText('The embed key is not allowed on this website.')
})

test<EcosystemTestContext>('CompatibleApps requires a device type', async (ctx) => {
  renderWithEcosystem(<CompatibleApps deviceType='' />, {
    ...ctx,
    embedKey: fakeEmbedKey,
  })
  await screen.findByText('Set a device type to list compatible apps.')
})

test<EcosystemTestContext>('CompatibleApps hides the title and search', async (ctx) => {
  renderWithEcosystem(
    <CompatibleApps deviceType='smartlock' hideTitle hideSearch />,
    { ...ctx, embedKey: fakeEmbedKey }
  )
  await screen.findByText('StayPilot')
  expect(screen.queryByText('Works with these apps')).toBeNull()
  expect(screen.queryByRole('searchbox')).toBeNull()
})

test<
  ApiTestContext & EcosystemTestContext
>('CompatibleApps works inside a SeamProvider with an embed key', async (ctx) => {
  render(
    <SeamProvider
      queryClient={new QueryClient()}
      publishableKey={ctx.seed.seam_pk1_token}
      userIdentifierKey={ctx.seed.john_user_identifier_key}
      endpoint={ctx.endpoint}
      embedKey={fakeEmbedKey}
      ecosystemEndpoint={ctx.ecosystemEndpoint}
      disableCssInjection
      disableFontInjection
      disableTelemetry
    >
      <CompatibleApps deviceType='smartlock' />
    </SeamProvider>
  )
  await screen.findByText('StayPilot')
})

import { useEffect, useState } from 'react'

import {
  getCapabilityLabel,
  getProvidersWithMissingRequirements,
  resolveProviderRequirements,
  scopeDeviceModelsToProvider,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import { useEcosystemDeviceModelSummaries } from 'lib/seam/ecosystem/use-ecosystem-device-model-summaries.js'
import { useEcosystemProviderRequirements } from 'lib/seam/ecosystem/use-ecosystem-provider-requirements.js'

import { Expand } from './Expand.js'
import { Groups } from './Groups.js'
import { Inline } from './Inline.js'
import { reviewDevice } from './model.js'
import { Notes } from './Notes.js'
import { Picker } from './Picker.js'
import { Table } from './Table.js'

const variants = [
  {
    name: 'Inline',
    title: 'Requirements beside each capability',
    description:
      'The most direct reading path. Everything is visible, with repetition when capabilities share requirements.',
    component: Inline,
  },
  {
    name: 'Notes',
    title: 'One shared list of requirements',
    description:
      'A shorter device row. Numbered references connect each capability to what you’ll need below.',
    component: Notes,
  },
  {
    name: 'Groups',
    title: 'Plan around the things you need',
    description:
      'Subscriptions and accessories appear once, each with the capabilities it enables. Clearer for planning a setup.',
    component: Groups,
  },
  {
    name: 'Table',
    title: 'Compare capabilities across models',
    description:
      'Scan down a capability column to compare devices. Wider than the other options; scroll the table on a phone.',
    component: Table,
  },
  {
    name: 'Expand',
    title: 'Open details for one capability',
    description:
      'Short requirement labels stay visible. Open a capability to read the full wording without expanding unrelated information.',
    component: Expand,
  },
]
const brands = [
  { slug: 'nuki', label: 'Nuki', provider: 'nuki-web' },
  { slug: 'august', label: 'August', provider: 'august-access' },
  { slug: 'keyincode', label: 'KeyInCode', provider: 'keyincode' },
]
const params = new URLSearchParams(window.location.search)
const requestedVariant = Number(params.get('v')) - 1
const initialVariant =
  Number.isInteger(requestedVariant) &&
  requestedVariant >= 0 &&
  requestedVariant < variants.length
    ? requestedVariant
    : 0

export function App(): JSX.Element {
  const [active, setActive] = useState(initialVariant)
  const [replay, setReplay] = useState(0)
  const [brandSlug, setBrandSlug] = useState(params.get('brand') ?? 'nuki')
  const [dark, setDark] = useState(params.get('theme') === 'dark')
  const [search, setSearch] = useState('')
  const [capability, setCapability] = useState('')
  const brand = brands.find((entry) => entry.slug === brandSlug) ?? brands[0]
  const variant = variants[active] ?? variants[0]

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('v', String(active + 1))
    url.searchParams.set('brand', brandSlug)
    url.searchParams.set('theme', dark ? 'dark' : 'light')
    window.history.replaceState(null, '', url)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
  }, [active, brandSlug, dark])

  const modelsQuery = useEcosystemDeviceModelSummaries({
    manufacturer: brand?.slug,
    provider: brand?.provider,
    deviceType: 'smartlock',
  })
  const scopedModels = scopeDeviceModelsToProvider(
    modelsQuery.deviceModels ?? [],
    brand?.provider
  )
  const missing = getProvidersWithMissingRequirements(scopedModels)
  const requirementsQuery = useEcosystemProviderRequirements(missing)
  const devices = resolveProviderRequirements(
    scopedModels,
    requirementsQuery.providers ?? []
  ).map(reviewDevice)
  const allCapabilities = [
    ...new Set(
      devices.flatMap((device) => device.capabilities.map((item) => item.name))
    ),
  ]
  const filtered = devices.filter((device) => {
    const text = [
      device.name,
      ...device.source.variants.map((item) => item.manufacturer_model_id),
    ]
      .join(' ')
      .toLowerCase()
    return (
      text.includes(search.toLowerCase().trim()) &&
      (capability === '' ||
        device.capabilities.some((item) => item.name === capability))
    )
  })
  const loading =
    modelsQuery.isLoading || (missing.length > 0 && requirementsQuery.isLoading)
  const error = modelsQuery.isError || requirementsQuery.isError
  if (variant == null || brand == null) return <p>Design review unavailable.</p>
  const Variant = variant.component

  return (
    <div
      className={`seam-ecosystem seam-ecosystem-theme-${dark ? 'dark' : 'light'} seam-proto-page`}
    >
      <aside
        className='seam-proto-review-bar'
        aria-label='Design review controls'
      >
        <span>
          <strong>DeviceDB</strong>{' '}
          <span className='seam-proto-muted'>/ Design review</span>
        </span>
        <div className='seam-proto-review-controls'>
          <label>
            Preview brand{' '}
            <select
              value={brand.slug}
              onChange={(event) => {
                setBrandSlug(event.target.value)
                setSearch('')
                setCapability('')
              }}
            >
              {brands.map((item) => (
                <option value={item.slug} key={item.slug}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type='button'
            aria-pressed={dark}
            onClick={() => {
              setDark(!dark)
            }}
          >
            Dark mode
          </button>
        </div>
      </aside>
      <div className='seam-proto-workspace'>
        <header className='seam-proto-intro'>
          <span className='seam-proto-eyebrow'>
            Option {active + 1} of 5 · {variant.name}
          </span>
          <h1>{variant.title}</h1>
          <p>{variant.description}</p>
          <p className='seam-proto-shortcuts'>
            Switch below or use keys 1–5 / ← →. R resets open details.
          </p>
        </header>
        <section className='seam-proto-stage' aria-labelledby='catalog-title'>
          <div className='seam-proto-context'>
            <span>Brand guides / {brand.label}</span>
            <a
              href={`https://www.seam.co/docs/device-and-system-integration-guides/${brand.slug}-locks/index`}
              target='_blank'
              rel='noreferrer'
            >
              View live guide ↗
            </a>
          </div>
          <h2 id='catalog-title'>Supported devices</h2>
          <p className='seam-proto-stage-description'>
            Capabilities available through Seam. Requirements below describe any
            additional setup.
          </p>
          <div className='seam-proto-filters'>
            <label className='seam-proto-search'>
              Search devices
              <input
                type='search'
                value={search}
                placeholder='Search by name or model number'
                onChange={(event) => {
                  setSearch(event.target.value)
                }}
              />
            </label>
            <label>
              Capability
              <select
                value={capability}
                onChange={(event) => {
                  setCapability(event.target.value)
                }}
              >
                <option value=''>All capabilities</option>
                {allCapabilities.map((name) => (
                  <option key={name} value={name}>
                    {getCapabilityLabel(name)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className='seam-proto-catalog-heading'>
            <strong>{brand.label}</strong>
            <span aria-live='polite'>
              {loading ? 'Loading…' : `${filtered.length} devices`}
            </span>
          </div>
          {loading ? (
            <p className='seam-proto-state' role='status'>
              Loading capabilities and requirements…
            </p>
          ) : error ? (
            <div className='seam-proto-state' role='alert'>
              <p>We couldn’t load the complete device information.</p>
              <button
                type='button'
                onClick={() => {
                  void modelsQuery.refetch()
                  void requirementsQuery.refetch()
                }}
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className='seam-proto-state'>
              <p>No devices match these filters.</p>
              <button
                type='button'
                onClick={() => {
                  setSearch('')
                  setCapability('')
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              key={`${active}-${replay}-${brand.slug}`}
              className={`seam-proto-variant seam-proto-variant-${variant.name.toLowerCase()}`}
            >
              <Variant devices={filtered} />
            </div>
          )}
          <a
            className='seam-proto-catalog-link'
            href={`https://www.seam.co/manufacturers/${brand.slug}`}
            target='_blank'
            rel='noreferrer'
          >
            View {brand.label} in the device catalog ↗
          </a>
        </section>
        <p className='seam-proto-review-note'>
          Review prototype · Live Ecosystem catalog ·{' '}
          <a href='https://linear.app/seam/issue/DEVDB-466'>
            Dawn’s design feedback ↗
          </a>
        </p>
      </div>
      <Picker
        names={variants.map((item) => item.name)}
        active={active}
        onChange={setActive}
        onReplay={() => {
          setReplay((value) => value + 1)
        }}
      />
    </div>
  )
}

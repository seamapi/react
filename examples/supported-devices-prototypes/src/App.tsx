import { useEffect, useRef, useState } from 'react'

import {
  getProvidersWithMissingRequirements,
  resolveProviderRequirements,
  scopeDeviceModelsToProvider,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import { useEcosystemDeviceModelSummaries } from 'lib/seam/ecosystem/use-ecosystem-device-model-summaries.js'
import { useEcosystemManufacturers } from 'lib/seam/ecosystem/use-ecosystem-manufacturers.js'
import { useEcosystemProviderRequirements } from 'lib/seam/ecosystem/use-ecosystem-provider-requirements.js'

import { BrandMark } from './BrandMark.js'
import { CapabilityFilter } from './CapabilityFilter.js'
import { CheckInfo } from './CheckInfo.js'
import { reviewDevice } from './model.js'
import { PhonePreview } from './PhonePreview.js'
import { Picker } from './Picker.js'
import {
  postPreviewFilters,
  type PreviewFilters,
  previewReadyMessage,
  readPreviewFilters,
} from './preview-filters.js'
import { RequirementPills } from './RequirementPills.js'
import { Legend } from './shared.js'
import { Stacked } from './Stacked.js'

const variants = [
  {
    name: 'Current',
    title: 'Two-line rows · current version',
    description:
      'Capability-specific icons, with accessory and subscription requirements shown as pills. Open a row for the specific requirements.',
    component: Stacked,
  },
  {
    name: 'Checks',
    title: 'Two-line rows · checks and info',
    description:
      'Green checks indicate support. Amber info icons and requirement pills indicate additional setup. Capability names stay visible.',
    component: CheckInfo,
  },
  {
    name: 'Pills',
    title: 'Two-line rows · requirement pills',
    description:
      'The same check/info treatment, with accessory and subscription pills. Open a row for the specific requirements.',
    component: RequirementPills,
  },
]
const brands = [
  { slug: 'nuki', label: 'Nuki', provider: 'nuki-web' },
  { slug: 'august', label: 'August', provider: 'august-access' },
  { slug: 'keyincode', label: 'KeyInCode', provider: 'keyincode' },
]
const params = new URLSearchParams(window.location.search)
const isMobilePreview = params.get('view') === 'mobile'
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
  const [compare, setCompare] = useState(params.get('compare') !== '0')
  const [requirementView, setRequirementView] = useState<'matrix' | 'list'>(
    params.get('requirements') === 'list' ? 'list' : 'matrix'
  )
  const [search, setSearch] = useState(params.get('q') ?? '')
  const [capabilities, setCapabilities] = useState(() => [
    ...new Set(params.getAll('capability').filter((name) => name !== '')),
  ])
  const phoneRef = useRef<HTMLIFrameElement>(null)
  const brand = brands.find((entry) => entry.slug === brandSlug) ?? brands[0]
  const variant = variants[active] ?? variants[0]

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('v', String(active + 1))
    url.searchParams.set('brand', brandSlug)
    url.searchParams.set('theme', dark ? 'dark' : 'light')
    url.searchParams.set('requirements', requirementView)
    if (!isMobilePreview) url.searchParams.set('compare', compare ? '1' : '0')
    if (search === '') url.searchParams.delete('q')
    else url.searchParams.set('q', search)
    url.searchParams.delete('capability')
    for (const name of capabilities) url.searchParams.append('capability', name)
    window.history.replaceState(null, '', url)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    document.documentElement.classList.toggle(
      'seam-proto-mobile-document',
      isMobilePreview
    )
  }, [active, brandSlug, dark, compare, search, capabilities, requirementView])

  useEffect(() => {
    const receiveFilters = (event: MessageEvent<unknown>): void => {
      const source = isMobilePreview
        ? window.parent
        : phoneRef.current?.contentWindow
      if (event.origin !== window.location.origin || event.source !== source)
        return
      if (!isMobilePreview && event.data === previewReadyMessage) {
        postPreviewFilters(source, { search, capabilities })
        return
      }
      const filters = readPreviewFilters(event.data)
      if (filters == null) return
      setSearch(filters.search)
      setCapabilities(filters.capabilities)
    }
    window.addEventListener('message', receiveFilters)
    return () => {
      window.removeEventListener('message', receiveFilters)
    }
  }, [search, capabilities])

  useEffect(() => {
    if (isMobilePreview)
      window.parent.postMessage(previewReadyMessage, window.location.origin)
  }, [])

  useEffect(() => {
    if (!isMobilePreview)
      postPreviewFilters(phoneRef.current?.contentWindow, {
        search,
        capabilities,
      })
  }, [search, capabilities])

  const changeFilters = (filters: PreviewFilters): void => {
    setSearch(filters.search)
    setCapabilities(filters.capabilities)
    if (isMobilePreview) postPreviewFilters(window.parent, filters)
  }

  const modelsQuery = useEcosystemDeviceModelSummaries({
    manufacturer: brand?.slug,
    provider: brand?.provider,
    deviceType: 'smartlock',
  })
  const rawModels = modelsQuery.deviceModels ?? []
  const missing = getProvidersWithMissingRequirements(rawModels)
  const requirementsQuery = useEcosystemProviderRequirements([
    ...(brand == null ? [] : [brand.provider]),
    ...rawModels.flatMap((model) =>
      model.providers.map((provider) => provider.slug)
    ),
  ])
  const { manufacturers } = useEcosystemManufacturers({
    slugs: brand == null ? [] : [brand.slug],
  })
  const manufacturer = manufacturers?.find(
    (entry) => entry.slug === brand?.slug
  )
  const resolvedModels = resolveProviderRequirements(
    rawModels,
    requirementsQuery.providers ?? []
  )
  const devices = scopeDeviceModelsToProvider(
    resolvedModels,
    brand?.provider
  ).map((source) =>
    reviewDevice(
      source,
      requirementsQuery.providers ?? [],
      resolvedModels.find(
        (model) => model.device_model_id === source.device_model_id
      )
    )
  )
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
      capabilities.every((name) =>
        device.capabilities.some((item) => item.name === name)
      )
    )
  })
  const loading =
    modelsQuery.isLoading || (missing.length > 0 && requirementsQuery.isLoading)
  const error =
    modelsQuery.isError || (missing.length > 0 && requirementsQuery.isError)
  if (variant == null || brand == null) return <p>Design review unavailable.</p>
  const Variant = variant.component

  const catalog = (
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
        Supported capabilities at a glance. Open a row for setup requirements
        and model details.
      </p>
      <div className='seam-proto-filters'>
        <label className='seam-proto-search'>
          Search devices
          <input
            type='search'
            value={search}
            placeholder='Search by name or model number'
            onChange={(event) => {
              changeFilters({ search: event.target.value, capabilities })
            }}
          />
        </label>
        <CapabilityFilter
          capabilities={allCapabilities}
          selected={capabilities}
          onChange={(capabilities) => {
            changeFilters({ search, capabilities })
          }}
        />
      </div>
      <div className='seam-proto-catalog-heading'>
        <div className='seam-proto-manufacturer'>
          <BrandMark name={brand.label} logos={manufacturer?.logos} />
          <strong>{brand.label}</strong>
        </div>
        <span aria-live='polite'>
          {loading ? 'Loading…' : `${filtered.length} devices`}
        </span>
      </div>
      <Legend />
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
              if (missing.length > 0) void requirementsQuery.refetch()
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
              changeFilters({ search: '', capabilities: [] })
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
          <Variant devices={filtered} requirementView={requirementView} />
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
  )
  const mobileParams = new URLSearchParams({
    view: 'mobile',
    v: String(active + 1),
    brand: brand.slug,
    theme: dark ? 'dark' : 'light',
    requirements: requirementView,
  })

  if (isMobilePreview)
    return (
      <div
        className={`seam-ecosystem seam-ecosystem-theme-${dark ? 'dark' : 'light'} seam-proto-page seam-proto-mobile-page`}
      >
        <main className='seam-proto-workspace'>{catalog}</main>
      </div>
    )

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
          <button
            type='button'
            aria-pressed={compare}
            onClick={() => {
              setCompare(!compare)
            }}
          >
            Compare mobile
          </button>
          <label>
            Preview brand{' '}
            <select
              value={brand.slug}
              onChange={(event) => {
                setBrandSlug(event.target.value)
                changeFilters({ search: '', capabilities: [] })
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
      <main
        className={`seam-proto-workspace${compare ? ' seam-proto-workspace-compare' : ''}`}
      >
        <header className='seam-proto-intro'>
          <span className='seam-proto-eyebrow'>
            Option {active + 1} of {variants.length} · {variant.name}
          </span>
          <h1>{variant.title}</h1>
          <p>{variant.description}</p>
          <p className='seam-proto-shortcuts'>
            Switch below or use keys 1–3 / ← →. R resets open details.
          </p>
        </header>
        <div
          className='seam-proto-requirement-picker'
          role='group'
          aria-label='Provider detail layouts'
        >
          <span>Provider details</span>
          <button
            type='button'
            aria-pressed={requirementView === 'matrix'}
            onClick={() => {
              setRequirementView('matrix')
            }}
          >
            Matrix · recommended
          </button>
          <button
            type='button'
            aria-pressed={requirementView === 'list'}
            onClick={() => {
              setRequirementView('list')
            }}
          >
            Capability list
          </button>
        </div>
        <div className={compare ? 'seam-proto-comparison' : undefined}>
          <div className='seam-proto-browser-preview'>
            {compare && (
              <div className='seam-proto-preview-label'>
                <strong>Desktop</strong>
                <span>
                  {variant.name} · {brand.label}
                </span>
              </div>
            )}
            {catalog}
          </div>
          {compare && (
            <PhonePreview
              key={replay}
              frameRef={phoneRef}
              src={`${window.location.pathname}?${mobileParams.toString()}`}
              title={`${brand.label} supported devices · ${variant.name} · mobile preview`}
            />
          )}
        </div>
        <p className='seam-proto-review-note'>
          Review prototype · Live Ecosystem catalog ·{' '}
          <a href='https://linear.app/seam/issue/DEVDB-466'>
            Dawn’s design feedback ↗
          </a>
        </p>
      </main>
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

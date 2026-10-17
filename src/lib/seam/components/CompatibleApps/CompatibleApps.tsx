import classNames from 'classnames'
import { useDeferredValue, useMemo, useState } from 'react'

import type {
  CompatiblePartner,
  PartnerAsset,
  PartnerAssetKind,
} from 'lib/seam/ecosystem/types.js'
import { useCompatiblePartners } from 'lib/seam/ecosystem/use-compatible-partners.js'
import { getEcosystemErrorMessage } from 'lib/ui/ecosystem/errors.js'
import { SearchField } from 'lib/ui/ecosystem/SearchField.js'
import { StateMessage } from 'lib/ui/ecosystem/StateMessage.js'
import {
  type EcosystemTheme,
  getEcosystemThemeClassName,
} from 'lib/ui/ecosystem/theme.js'

export interface CompatibleAppsProps {
  /** Device category, e.g., `smartlock`, `thermostat`, `sensor`, `intercom`. */
  deviceType: string
  /** DeviceDB manufacturer slug. Lists the apps that support this brand. */
  manufacturer?: string | undefined
  /** DeviceDB provider slug, i.e., the cloud the devices connect through. */
  provider?: string | undefined
  /** DeviceDB capability, e.g., `can_provision_mobile_keys`. Shows per-app notes. */
  capability?: string | undefined
  /** Industry slug to restrict the apps, e.g., `short-term-rental`. */
  industry?: string | undefined
  /** Apps shown before the show more button. */
  maxVisible?: number | undefined
  hideSearch?: boolean | undefined
  hideTitle?: boolean | undefined
  /** Color theme. `auto` follows the visitor's color scheme. */
  theme?: EcosystemTheme | undefined
  className?: string | undefined
}

const defaultMaxVisible = 24

/**
 * The live apps (Seam partners) that work with a device category,
 * manufacturer, provider or capability through Seam.
 */
export function CompatibleApps({
  deviceType,
  manufacturer = '',
  provider = '',
  capability = '',
  industry = '',
  maxVisible = defaultMaxVisible,
  hideSearch = false,
  hideTitle = false,
  theme = 'light',
  className,
}: CompatibleAppsProps): JSX.Element {
  const { partners, isPending, isError, error, refetch } =
    useCompatiblePartners({
      deviceType: deviceType ?? '',
      manufacturer,
      provider,
      capability,
      industry,
    })

  const [searchValue, setSearchValue] = useState('')
  const [showAll, setShowAll] = useState(false)
  const query = useDeferredValue(searchValue.toLowerCase().trim())

  const sortedPartners = useMemo(
    () => [...(partners ?? [])].sort(comparePartners),
    [partners]
  )

  const filteredPartners = useMemo(
    () =>
      query.length === 0
        ? sortedPartners
        : sortedPartners.filter((partner) => matchesSearch(partner, query)),
    [sortedPartners, query]
  )

  const visibleCount = getVisibleCount(maxVisible)
  const visiblePartners = showAll
    ? filteredPartners
    : filteredPartners.slice(0, visibleCount)
  const hiddenCount = filteredPartners.length - visiblePartners.length
  const showNotes = capability.length > 0 || provider.length > 0
  const isMissingDeviceType = (deviceType ?? '').trim().length === 0

  const content = (() => {
    if (isMissingDeviceType) {
      return <StateMessage role='alert'>{t.missingDeviceType}</StateMessage>
    }

    if (isError) {
      const { message, canRetry } = getEcosystemErrorMessage(error, t.error)
      return (
        <StateMessage
          role='alert'
          {...(canRetry
            ? {
                actionLabel: t.retry,
                onAction: () => {
                  void refetch()
                },
              }
            : {})}
        >
          {message}
        </StateMessage>
      )
    }

    if (isPending) {
      return <LoadingGrid count={Math.min(visibleCount, 8)} />
    }

    if (sortedPartners.length === 0) {
      return <StateMessage>{t.noApps}</StateMessage>
    }

    if (filteredPartners.length === 0) {
      return (
        <StateMessage
          actionLabel={t.clearSearch}
          onAction={() => {
            setSearchValue('')
          }}
        >
          {t.noSearchResults(searchValue.trim())}
        </StateMessage>
      )
    }

    return (
      <>
        <ul className='seam-compatible-apps-grid'>
          {visiblePartners.map((partner) => (
            <PartnerCard
              key={partner.partner_id}
              partner={partner}
              showNote={showNotes}
            />
          ))}
        </ul>
        {hiddenCount > 0 && (
          <div className='seam-compatible-apps-footer'>
            <button
              type='button'
              className='seam-ecosystem-button'
              onClick={() => {
                setShowAll(true)
              }}
            >
              {t.showMore(hiddenCount)}
            </button>
          </div>
        )}
      </>
    )
  })()

  const showHeader = !hideTitle || !hideSearch

  return (
    <div
      className={classNames(
        'seam-ecosystem',
        'seam-compatible-apps',
        getEcosystemThemeClassName(theme),
        className
      )}
    >
      {showHeader && (
        <div className='seam-ecosystem-header'>
          {!hideTitle && <h2 className='seam-ecosystem-title'>{t.title}</h2>}
          {!hideSearch && (
            <SearchField
              label={t.search}
              value={searchValue}
              onChange={setSearchValue}
              disabled={isPending || isError || isMissingDeviceType}
            />
          )}
        </div>
      )}
      {content}
    </div>
  )
}

function PartnerCard({
  partner,
  showNote,
}: {
  partner: CompatiblePartner
  showNote: boolean
}): JSX.Element {
  const logo = getPartnerLogo(partner, lightLogoKinds)
  const darkLogo = getPartnerLogo(partner, darkLogoKinds)
  const hasDarkLogo = darkLogo != null && darkLogo.url !== logo?.url
  const note = showNote ? partner.support.note : null
  const subtitle = partner.industries.map((i) => i.display_name).join(' · ')

  const body = (
    <>
      <div className='seam-compatible-apps-logo'>
        {logo == null ? (
          <span className='seam-compatible-apps-logo-initial' aria-hidden>
            {partner.display_name.slice(0, 1)}
          </span>
        ) : (
          <>
            <img
              loading='lazy'
              src={logo.url}
              alt={t.logoAlt(partner.display_name)}
              width={48}
              height={48}
              className={classNames({
                'seam-ecosystem-light-only': hasDarkLogo,
              })}
            />
            {hasDarkLogo && (
              <img
                loading='lazy'
                src={darkLogo.url}
                alt=''
                width={48}
                height={48}
                className='seam-ecosystem-dark-only'
              />
            )}
          </>
        )}
      </div>
      <div className='seam-compatible-apps-text'>
        <span className='seam-compatible-apps-name'>
          {partner.display_name}
        </span>
        {subtitle.length > 0 && (
          <span className='seam-compatible-apps-subtitle'>{subtitle}</span>
        )}
        {note != null && note.length > 0 && (
          <span className='seam-compatible-apps-note'>{note}</span>
        )}
      </div>
    </>
  )

  return (
    <li className='seam-compatible-apps-card'>
      {partner.website == null ? (
        <div className='seam-compatible-apps-card-body'>{body}</div>
      ) : (
        <a
          href={partner.website}
          target='_blank'
          rel='noopener noreferrer'
          className='seam-compatible-apps-card-body'
        >
          {body}
        </a>
      )}
    </li>
  )
}

function LoadingGrid({ count }: { count: number }): JSX.Element {
  return (
    <ul className='seam-compatible-apps-grid' aria-busy='true'>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className='seam-compatible-apps-card'>
          <div className='seam-compatible-apps-card-body'>
            <div className='seam-ecosystem-skeleton seam-compatible-apps-logo' />
            <div className='seam-compatible-apps-text'>
              <div className='seam-ecosystem-skeleton seam-ecosystem-skeleton-line' />
              <div className='seam-ecosystem-skeleton seam-ecosystem-skeleton-line-short' />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

const lightLogoKinds: PartnerAssetKind[] = [
  'square_logo',
  'horizontal_logo',
  'square_logo_mono',
  'horizontal_logo_mono',
]

const darkLogoKinds: PartnerAssetKind[] = [
  'square_logo_mono',
  'square_logo',
  'horizontal_logo_mono',
  'horizontal_logo',
]

const getPartnerLogo = (
  partner: CompatiblePartner,
  kinds: PartnerAssetKind[]
): PartnerAsset | null => {
  for (const kind of kinds) {
    const asset = partner.assets.find((a) => a.kind === kind)
    if (asset != null) return asset
  }
  return null
}

const comparePartners = (
  a: CompatiblePartner,
  b: CompatiblePartner
): number => {
  if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
  return a.display_name.localeCompare(b.display_name)
}

const matchesSearch = (partner: CompatiblePartner, query: string): boolean =>
  partner.display_name.toLowerCase().includes(query) ||
  partner.industries.some((i) =>
    i.display_name.toLowerCase().includes(query)
  ) ||
  partner.solutions.some((s) => s.display_name.toLowerCase().includes(query))

const getVisibleCount = (maxVisible: number): number =>
  Number.isFinite(maxVisible) && maxVisible > 0
    ? Math.floor(maxVisible)
    : defaultMaxVisible

const t = {
  title: 'Works with these apps',
  search: 'Search apps',
  error: 'An error occurred while loading compatible apps.',
  retry: 'Retry',
  noApps: 'No apps are listed for this selection yet.',
  noSearchResults: (query: string) => `No apps found for "${query}".`,
  clearSearch: 'Clear search',
  showMore: (count: number) =>
    `Show ${count} more ${count === 1 ? 'app' : 'apps'}`,
  logoAlt: (name: string) => `${name} logo`,
  missingDeviceType: 'Set a device type to list compatible apps.',
}

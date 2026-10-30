import { createContext, type PropsWithChildren, useContext } from 'react'

import {
  getDeviceModelImageUrl,
  getDeviceModelName,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import type { DeviceModelSummary } from 'lib/seam/ecosystem/types.js'
import { useEcosystemDeviceModelSummaries } from 'lib/seam/ecosystem/use-ecosystem-device-model-summaries.js'

import { getRequirementKinds } from './model.js'

const AccessoryContext = createContext<{
  models: DeviceModelSummary[]
  isLoading: boolean
  isError: boolean
} | null>(null)

/** One batched lookup per catalog, shared by every expanded provider. */
export function AccessoryCatalog({
  slugs,
  children,
}: PropsWithChildren<{ slugs: string[] }>): JSX.Element {
  const { deviceModels, isLoading, isError } = useEcosystemDeviceModelSummaries(
    {
      slugs,
      enabled: slugs.length > 0,
    }
  )
  return (
    <AccessoryContext.Provider
      value={{ models: deviceModels ?? [], isLoading, isError }}
    >
      {children}
    </AccessoryContext.Provider>
  )
}

export function AccessoryLinks({
  message,
  slugs = [],
}: {
  message: string
  slugs?: string[] | undefined
}): JSX.Element | null {
  const catalog = useContext(AccessoryContext)
  if (slugs.length === 0 || catalog == null) return null
  const kinds = getRequirementKinds(message)
  const label = kinds.includes('bridge')
    ? 'Compatible bridges'
    : kinds.includes('keypad')
      ? 'Compatible keypads'
      : 'Compatible accessories'
  const models = [...new Set(slugs)].flatMap((slug) => {
    const model = catalog.models.find((entry) => entry.slug === slug)
    return model == null ? [] : [model]
  })
  return (
    <div className='seam-proto-accessories'>
      <p className='seam-proto-accessories-label'>{label}</p>
      {catalog.isLoading ? (
        <p className='seam-proto-accessories-state' role='status'>
          Loading accessories…
        </p>
      ) : (
        <>
          {models.length > 0 && (
            <ul className='seam-proto-accessory-list' aria-label={label}>
              {models.map((model) => {
                const image = getDeviceModelImageUrl(model)
                const name = getDeviceModelName(model)
                const manufacturer = model.manufacturer
                const href =
                  manufacturer == null || model.device_type == null
                    ? null
                    : `https://www.seam.co/${encodeURIComponent(model.device_type.slug)}s/${encodeURIComponent(manufacturer.slug)}_${encodeURIComponent(model.slug)}`
                const content = (
                  <>
                    {image != null && (
                      <img
                        src={image}
                        alt=''
                        loading='lazy'
                        width='28'
                        height='28'
                      />
                    )}
                    <div>
                      {name}
                      {manufacturer != null && (
                        <span>
                          {manufacturer.display_name ?? manufacturer.slug}
                        </span>
                      )}
                    </div>
                    {href != null && (
                      <span className='seam-proto-accessory-arrow' aria-hidden>
                        ↗
                      </span>
                    )}
                  </>
                )
                return (
                  <li key={model.device_model_id}>
                    {href == null ? (
                      <div className='seam-proto-accessory-link'>{content}</div>
                    ) : (
                      <a
                        className='seam-proto-accessory-link'
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {content}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          {(catalog.isError || models.length < new Set(slugs).size) && (
            <p className='seam-proto-accessories-state'>
              Some accessory details couldn’t be loaded.
            </p>
          )}
        </>
      )}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'

import {
  type EcosystemApiError,
  fetchEcosystem,
} from 'lib/seam/ecosystem/client.js'
import { useEcosystemContext } from 'lib/seam/ecosystem/EcosystemProvider.js'
import type {
  CompatibilityResponse,
  CompatiblePartner,
} from 'lib/seam/ecosystem/types.js'
import {
  retryEcosystemQuery,
  type UseEcosystemQueryResult,
} from 'lib/seam/ecosystem/use-ecosystem-query-result.js'

export interface UseCompatiblePartnersParams {
  /** Device category, e.g., `smartlock`, `thermostat`, `sensor`, `intercom`. */
  deviceType: string
  /** DeviceDB manufacturer slug, e.g., `schlage`. */
  manufacturer?: string | undefined
  /** DeviceDB provider slug, e.g., `salto-ks`. */
  provider?: string | undefined
  /** DeviceDB capability, e.g., `can_provision_mobile_keys`. */
  capability?: string | undefined
  /** Industry slug, e.g., `short-term-rental`. */
  industry?: string | undefined
}

export type UseCompatiblePartnersData = CompatiblePartner[]

/**
 * The live partners that support a device category, manufacturer, provider
 * or capability through Seam, from Ecosystem `GET /v1/compatibility`.
 * Declared-first: a partner is listed only where Seam or the partner declared support.
 */
export function useCompatiblePartners({
  deviceType,
  manufacturer = '',
  provider = '',
  capability = '',
  industry = '',
}: UseCompatiblePartnersParams): UseEcosystemQueryResult<
  'partners',
  UseCompatiblePartnersData
> {
  const { embedKey, endpoint } = useEcosystemContext()

  const params = {
    device_category: deviceType.trim(),
    manufacturer_slug: manufacturer.trim(),
    provider_slug: provider.trim(),
    capability: capability.trim(),
    industry: industry.trim(),
  }

  const { data, ...rest } = useQuery<
    UseCompatiblePartnersData,
    EcosystemApiError
  >({
    enabled: params.device_category.length > 0,
    queryKey: [
      'ecosystem',
      endpoint,
      embedKey ?? null,
      'compatibility',
      params,
    ],
    queryFn: async ({ signal }) => {
      const { partners } = await fetchEcosystem<CompatibilityResponse>(
        'compatibility',
        { endpoint, embedKey, params, signal }
      )
      return partners
    },
    retry: retryEcosystemQuery,
  })

  return { ...rest, partners: data }
}

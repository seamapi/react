import {
  dehydrate,
  type DehydratedState,
  QueryClient,
} from '@tanstack/react-query'

import {
  applyEmbedExclusions,
  capabilityLabels,
  resolveProviderRequirements,
  scopeDeviceModelsToProvider,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import {
  getAccessorySlugs,
  presentDevice,
} from 'lib/seam/components/SupportedDevices/presentation.js'
import type { SupportedDevicesProps } from 'lib/seam/components/SupportedDevices/SupportedDevices.js'

import type { EcosystemRequestOptions } from './client.js'
import type { EcosystemOptions } from './EcosystemProvider.js'
import { getEmbedKeyManufacturer } from './embed-resolution.js'
import {
  normalizeEcosystemOptions,
  normalizeOptionalString,
} from './options.js'
import {
  deviceModelSummariesQuery,
  embedResolutionQuery,
  manufacturersQuery,
  providerRequirementsQuery,
} from './queries.js'

export interface PrefetchSupportedDevicesOptions
  extends EcosystemOptions,
    Pick<
      SupportedDevicesProps,
      'manufacturer' | 'provider' | 'deviceType' | 'capability'
    >,
    Pick<EcosystemRequestOptions, 'fetch' | 'origin'> {}

/**
 * Fetch the complete initial SupportedDevices view before rendering HTML.
 * Pass the result to EcosystemProvider.dehydratedState and use the same key,
 * endpoint and SupportedDevices filters on both server and client.
 * Supply the page origin when using an embed key so its allowlist is checked.
 * Each call owns its query cache; failures throw instead of serializing a loader.
 */
export async function prefetchSupportedDevices(
  options: PrefetchSupportedDevicesOptions = {}
): Promise<DehydratedState> {
  const context = {
    ...normalizeEcosystemOptions(options),
    fetch: options.fetch,
    origin: options.origin,
  }
  if (
    context.embedKey != null &&
    (context.origin == null || context.origin.trim().length === 0)
  ) {
    throw new Error(
      'prefetchSupportedDevices requires the page origin when using an embed key.'
    )
  }
  if (context.origin != null) {
    const origin = new URL(context.origin)
    if (
      !['http:', 'https:'].includes(origin.protocol) ||
      origin.origin !== context.origin
    ) {
      throw new Error(
        'Supply origin as an HTTP(S) origin, e.g., https://example.com.'
      )
    }
  }

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  try {
    const capability = options.capability?.trim() ?? ''
    const provider = normalizeOptionalString(options.provider) ?? null
    const resolution =
      context.embedKey == null
        ? undefined
        : await queryClient.fetchQuery(
            embedResolutionQuery(context, capability)
          )
    const query = deviceModelSummariesQuery(context, {
      manufacturer:
        normalizeOptionalString(options.manufacturer) ??
        getEmbedKeyManufacturer(resolution) ??
        '',
      provider: provider ?? '',
      deviceType: options.deviceType,
      capability: capability in capabilityLabels ? capability : '',
    })
    const models = applyEmbedExclusions(
      await queryClient.fetchQuery(query),
      resolution?.exclusions
    )
    // Exclusions must apply to serialized data too, not only to visible rows.
    queryClient.setQueryData(query.queryKey, models)
    const providerSlugs = models.flatMap((model) =>
      model.providers.map((provider) => provider.slug)
    )
    const scopedModels = scopeDeviceModelsToProvider(models, provider)
    const manufacturerSlugs = scopedModels.flatMap((model) =>
      model.manufacturer == null ? [] : [model.manufacturer.slug]
    )
    const [providers] = await Promise.all([
      providerSlugs.length === 0
        ? []
        : queryClient.fetchQuery(
            providerRequirementsQuery(context, providerSlugs)
          ),
      manufacturerSlugs.length === 0
        ? []
        : queryClient.fetchQuery(
            manufacturersQuery(context, manufacturerSlugs)
          ),
    ])
    const resolvedModels = resolveProviderRequirements(models, providers)
    const modelsById = new Map(
      resolvedModels.map((model) => [model.device_model_id, model])
    )
    const devices = scopeDeviceModelsToProvider(resolvedModels, provider).map(
      (model) =>
        presentDevice(
          model,
          providers,
          modelsById.get(model.device_model_id),
          provider ?? undefined
        )
    )
    const accessorySlugs = getAccessorySlugs(devices)
    if (accessorySlugs.length > 0) {
      const accessoriesQuery = deviceModelSummariesQuery(context, {
        slugs: accessorySlugs,
      })
      const accessories = await queryClient.fetchQuery(accessoriesQuery)
      queryClient.setQueryData(
        accessoriesQuery.queryKey,
        applyEmbedExclusions(accessories, resolution?.exclusions)
      )
    }
    return dehydrate(queryClient)
  } finally {
    queryClient.clear()
  }
}

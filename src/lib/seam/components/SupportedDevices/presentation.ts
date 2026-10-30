import {
  getCapabilityLabel,
  getCapabilityRequirementMessages,
  getDeviceModelName,
  getSupportedCapabilities,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import type {
  CapabilitySummary,
  DeviceAsset,
  DeviceModelSummary,
  IntegrationSupportLevel,
  ProviderRef,
  ProviderRequirements,
} from 'lib/seam/ecosystem/types.js'

export interface Capability {
  name: string
  label: string
  messages: string[]
}

export interface PresentedDevice {
  source: DeviceModelSummary
  name: string
  capabilities: Capability[]
  requirements: Array<{
    message: string
    capabilities: string[]
    deviceSlugs?: string[]
  }>
  providers: PresentedProvider[]
}

interface PresentedProvider extends ProviderRef {
  logos?: DeviceAsset[]
  primary: boolean
  integrationStatus: 'supported' | 'unsupported' | 'unknown'
  capabilities: Capability[]
  requirements: PresentedDevice['requirements']
}

export type RequirementKind =
  | 'subscription'
  | 'bridge'
  | 'keypad'
  | 'legal'
  | 'other'

/** UI aliases for source prose, which can describe more than one prerequisite. */
export function getRequirementKinds(message: string): RequirementKind[] {
  const known: Record<string, RequirementKind> = {
    'A compatible bridge is required.': 'bridge',
    'An external keypad is required.': 'keypad',
    'A paying Nuki SmartHosting subscription is required.': 'subscription',
  }
  const kinds: RequirementKind[] = []
  const knownKind = known[message.trim()]
  if (knownKind != null) kinds.push(knownKind)
  if (/\b(?:eula|waiver|end[- ]user licen[cs]e agreement)\b/i.test(message))
    kinds.push('legal')
  if (/\binstall\s+(?:a\s+)?seam\s+bridge\b/i.test(message))
    kinds.push('bridge')
  return kinds.length === 0 ? ['other'] : [...new Set(kinds)]
}

export function presentDevice(
  source: DeviceModelSummary,
  providers: ProviderRequirements[] = [],
  allProvidersSource: DeviceModelSummary = source,
  primaryProvider?: string
): PresentedDevice {
  const capabilities = reviewCapabilities(source)
  const primarySlug = primaryProvider
  return {
    source,
    name: getDeviceModelName(source),
    capabilities,
    requirements: reviewRequirements(capabilities, source),
    providers: allProvidersSource.providers
      .map((provider) => {
        const details = providers.find((entry) => entry.slug === provider.slug)
        const providerCapabilities =
          allProvidersSource.capabilities_by_provider.filter(
            (entry) => entry.provider.slug === provider.slug
          )
        const providerSource = {
          ...allProvidersSource,
          capabilities_by_provider: providerCapabilities,
        }
        const capabilities = reviewCapabilities(providerSource)
        // Provider metadata distinguishes a missing integration from missing
        // device capabilities. Connectivity alone does not imply Seam support.
        const levels =
          details?.integrations != null && details.integrations.length > 0
            ? details.integrations.map(
                (entry) => entry.integration_support_level
              )
            : allProvidersSource.capabilities_stale
              ? []
              : providerCapabilities.flatMap((entry) =>
                  entry.capabilities
                    .filter(
                      (capability) => capability.name !== 'device_connectivity'
                    )
                    .map((capability) => capability.integration_support_level)
                )
        return {
          ...provider,
          display_name: details?.display_name ?? provider.display_name,
          logos: details?.logos,
          primary: provider.slug === primarySlug,
          integrationStatus: getIntegrationStatus(levels),
          capabilities,
          requirements: reviewRequirements(capabilities, providerSource),
        }
      })
      .sort((a, b) => {
        const unsupported =
          Number(a.integrationStatus === 'unsupported') -
          Number(b.integrationStatus === 'unsupported')
        if (unsupported !== 0) return unsupported
        if (a.primary !== b.primary) return a.primary ? -1 : 1
        return (a.display_name ?? a.slug).localeCompare(
          b.display_name ?? b.slug
        )
      }),
  }
}

function getIntegrationStatus(
  levels: Array<IntegrationSupportLevel | null>
): PresentedProvider['integrationStatus'] {
  if (levels.some((level) => level === 'stable' || level === 'beta'))
    return 'supported'
  if (levels.length === 0 || levels.some((level) => level == null))
    return 'unknown'
  return 'unsupported'
}

function reviewCapabilities(source: DeviceModelSummary): Capability[] {
  return getSupportedCapabilities(source)
    .filter((capability) => capability.name !== 'device_connectivity')
    .map((capability) => ({
      name: capability.name,
      label: `${getCapabilityLabel(capability.name)}${capability.integrationSupportLevel === 'beta' ? ' (beta)' : ''}`,
      messages: getCapabilityRequirementMessages(capability),
    }))
}

function reviewRequirements(
  capabilities: Capability[],
  source: DeviceModelSummary
): PresentedDevice['requirements'] {
  const requirements = new Map<string, string[]>()
  for (const capability of capabilities)
    for (const message of capability.messages)
      requirements.set(message, [
        ...(requirements.get(message) ?? []),
        capability.label,
      ])
  return [...requirements].map(([message, labels]) => ({
    message,
    capabilities: labels,
    deviceSlugs: [
      ...new Set(
        source.capabilities_by_provider.flatMap(
          ({ capabilities: rawCapabilities }) =>
            rawCapabilities
              .filter((capability) =>
                capabilities.some(
                  (supported) =>
                    supported.name === capability.name &&
                    supported.messages.includes(message)
                )
              )
              .flatMap((capability) =>
                getRequirementDeviceSlugs(capability, rawCapabilities, message)
              )
        )
      ),
    ],
  }))
}

/** Follow capability dependencies within the same model/provider only. */
function getRequirementDeviceSlugs(
  capability: CapabilitySummary,
  capabilities: CapabilitySummary[],
  message: string,
  visited = new Set<string>()
): string[] {
  if (visited.has(capability.name)) return []
  visited.add(capability.name)
  const slugs = Object.values(capability.report?.requirements ?? {})
    .filter((requirement) => requirement.message === message)
    .flatMap((requirement) => requirement.device_slugs ?? [])
  for (const name of capability.report?.dependencies ?? []) {
    const dependency = capabilities.find((entry) => entry.name === name)
    if (dependency != null)
      slugs.push(
        ...getRequirementDeviceSlugs(dependency, capabilities, message, visited)
      )
  }
  return slugs
}

/** Presentation aliases for known requirements; unfamiliar source copy stays explicit. */
export function getRequirementPills(
  device: Pick<PresentedDevice, 'requirements'>
): Array<{ label: string; messages: string[] }> {
  const labels: Record<RequirementKind, string> = {
    bridge: 'Accessories Required',
    keypad: 'Accessories Required',
    subscription: 'Subscription Required',
    legal: 'Legal Requirements',
    other: 'Other Requirements',
  }
  const groups = new Map<string, string[]>()
  for (const { message } of device.requirements) {
    for (const kind of getRequirementKinds(message)) {
      const label = labels[kind]
      groups.set(label, [...(groups.get(label) ?? []), message])
    }
  }
  return [
    'Accessories Required',
    'Subscription Required',
    'Legal Requirements',
    'Other Requirements',
  ].flatMap((label) => {
    const messages = groups.get(label)
    return messages == null ? [] : [{ label, messages }]
  })
}

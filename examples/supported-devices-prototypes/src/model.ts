import {
  getCapabilityLabel,
  getCapabilityRequirementMessages,
  getDeviceModelName,
  getSupportedCapabilities,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import type {
  DeviceAsset,
  DeviceModelSummary,
  ProviderRef,
  ProviderRequirements,
} from 'lib/seam/ecosystem/types.js'

export interface Capability {
  name: string
  label: string
  messages: string[]
}

export interface ReviewDevice {
  source: DeviceModelSummary
  name: string
  capabilities: Capability[]
  requirements: Array<{ message: string; capabilities: string[] }>
  providers: ReviewProvider[]
}

interface ReviewProvider extends ProviderRef {
  logos?: DeviceAsset[]
  primary: boolean
  capabilities: Capability[]
  requirements: ReviewDevice['requirements']
}

export interface VariantProps {
  devices: ReviewDevice[]
  requirementView?: 'matrix' | 'list'
}

export type RequirementKind = 'subscription' | 'bridge' | 'keypad' | 'other'

export function getRequirementKind(message: string): RequirementKind {
  const known: Record<string, RequirementKind> = {
    'A compatible bridge is required.': 'bridge',
    'An external keypad is required.': 'keypad',
    'A paying Nuki SmartHosting subscription is required.': 'subscription',
  }
  return known[message] ?? 'other'
}

export function reviewDevice(
  source: DeviceModelSummary,
  providers: ProviderRequirements[] = [],
  allProvidersSource: DeviceModelSummary = source
): ReviewDevice {
  const capabilities = reviewCapabilities(source)
  const primarySlug = source.providers[0]?.slug
  return {
    source,
    name: getDeviceModelName(source),
    capabilities,
    requirements: reviewRequirements(capabilities),
    providers: allProvidersSource.providers
      .map((provider) => {
        const details = providers.find((entry) => entry.slug === provider.slug)
        const capabilities = reviewCapabilities({
          ...allProvidersSource,
          capabilities_by_provider:
            allProvidersSource.capabilities_by_provider.filter(
              (entry) => entry.provider.slug === provider.slug
            ),
        })
        return {
          ...provider,
          display_name: details?.display_name ?? provider.display_name,
          logos: details?.logos,
          primary: provider.slug === primarySlug,
          capabilities,
          requirements: reviewRequirements(capabilities),
        }
      })
      .sort((a, b) => {
        if (a.primary !== b.primary) return a.primary ? -1 : 1
        return (a.display_name ?? a.slug).localeCompare(
          b.display_name ?? b.slug
        )
      }),
  }
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
  capabilities: Capability[]
): ReviewDevice['requirements'] {
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
  }))
}

/** Presentation aliases for known requirements; unfamiliar source copy stays explicit. */
export function getRequirementPills(
  device: ReviewDevice
): Array<{ label: string; messages: string[] }> {
  const labels: Record<RequirementKind, string> = {
    bridge: 'Accessories Required',
    keypad: 'Accessories Required',
    subscription: 'Subscription Required',
    other: 'Other Requirements',
  }
  const groups = new Map<string, string[]>()
  for (const { message } of device.requirements) {
    const label = labels[getRequirementKind(message)]
    groups.set(label, [...(groups.get(label) ?? []), message])
  }
  return [
    'Accessories Required',
    'Subscription Required',
    'Other Requirements',
  ].flatMap((label) => {
    const messages = groups.get(label)
    return messages == null ? [] : [{ label, messages }]
  })
}

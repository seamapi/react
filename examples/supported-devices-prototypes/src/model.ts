import {
  getCapabilityLabel,
  getCapabilityRequirementMessages,
  getDeviceModelName,
  getSupportedCapabilities,
} from 'lib/seam/components/SupportedDevices/device-models.js'
import type { DeviceModelSummary } from 'lib/seam/ecosystem/types.js'

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
}

export interface VariantProps {
  devices: ReviewDevice[]
}

export function reviewDevice(source: DeviceModelSummary): ReviewDevice {
  const capabilities = getSupportedCapabilities(source)
    .filter((capability) => capability.name !== 'device_connectivity')
    .map((capability) => ({
      name: capability.name,
      label: `${getCapabilityLabel(capability.name)}${capability.integrationSupportLevel === 'beta' ? ' (beta)' : ''}`,
      messages: getCapabilityRequirementMessages(capability),
    }))
  const requirements = new Map<string, string[]>()
  for (const capability of capabilities)
    for (const message of capability.messages)
      requirements.set(message, [
        ...(requirements.get(message) ?? []),
        capability.label,
      ])
  return {
    source,
    name: getDeviceModelName(source),
    capabilities,
    requirements: [...requirements].map(([message, labels]) => ({
      message,
      capabilities: labels,
    })),
  }
}

/** Presentation aliases for known requirements; unfamiliar source copy stays explicit. */
export function getRequirementPills(
  device: ReviewDevice
): Array<{ label: string; messages: string[] }> {
  const known: Record<string, string> = {
    'A compatible bridge is required.': 'Accessories Required',
    'An external keypad is required.': 'Accessories Required',
    'A paying Nuki SmartHosting subscription is required.':
      'Subscription Required',
  }
  const groups = new Map<string, string[]>()
  for (const { message } of device.requirements) {
    const label = known[message] ?? 'Other Requirements'
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

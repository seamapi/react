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

// Short labels only for exact known copy; preserve unfamiliar constraints in full.
export function requirementLabel(message: string): string {
  const labels: Record<string, string> = {
    'A paying Nuki SmartHosting subscription is required.':
      'Nuki SmartHosting subscription',
    'A compatible bridge is required.': 'Compatible bridge',
    'An external keypad is required.': 'External keypad',
    'Additional setup is required.': 'Additional setup',
  }
  return labels[message] ?? message
}

export function requirementSummary(capability: Capability): string {
  return capability.messages.length === 0
    ? 'Supported'
    : `Requires: ${capability.messages.map(requirementLabel).join(' + ')}`
}

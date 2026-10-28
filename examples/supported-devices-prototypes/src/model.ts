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

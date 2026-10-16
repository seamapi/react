import type { EcosystemElementProps } from 'lib/ecosystem-element.js'

import type { CompatibleAppsProps } from './CompatibleApps.js'

export const name = 'seam-compatible-apps'

export const props: EcosystemElementProps<CompatibleAppsProps> = {
  deviceType: 'string',
  manufacturer: 'string',
  provider: 'string',
  capability: 'string',
  industry: 'string',
  maxVisible: 'number',
  hideSearch: 'boolean',
  hideTitle: 'boolean',
  theme: 'string',
}

export { CompatibleApps as Component } from './CompatibleApps.js'

import { defineEcosystemElements } from 'lib/ecosystem-element.js'
import * as components from 'lib/seam/components/ecosystem-elements.js'

/**
 * The lightweight Seam Ecosystem web components bundle:
 * only <seam-compatible-apps> and <seam-supported-devices>,
 * without the Seam API client used by the other Seam Components.
 * These elements are also defined by elements.js.
 */
export const elementNames: string[] = defineEcosystemElements(components)

export default elementNames

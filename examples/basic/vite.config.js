import { env } from 'node:process'

import createConfig from '../create-vite-config.js'

if (env.SEAM_PUBLISHABLE_KEY == null) {
  // eslint-disable-next-line no-console
  console.error(
    `> To run this example, set SEAM_PUBLISHABLE_KEY in your environment.
> Get one for free at https://console.seam.co/
`
  )
  process.exit(1)
}

/** @type {import('vite').ResolvedConfig} */
export default createConfig(import.meta.url)

import { env } from 'node:process'
import { setTimeout } from 'node:timers/promises'

import createConfig from '../create-vite-config.js'

/** @type {import('vite').ResolvedConfig} */
export default async () => {
  if (env.SEAM_PUBLISHABLE_KEY == null) {
    // eslint-disable-next-line no-console
    console.warn(
      `> Using the default publishable key.
> Use your own by setting SEAM_PUBLISHABLE_KEY in your environment.
> Get one for free at https://console.seam.co/
`
    )
    await setTimeout(2000)
    env.SEAM_PUBLISHABLE_KEY = 'seam_pk1fGd41X_zKs0ZELRWEc8nWxiBsrTFC98'
  }

  return createConfig(import.meta.url)
}

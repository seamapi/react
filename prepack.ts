import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { $ } from 'execa'

import { readPackageJson } from './vite.config.js'

const versionFile = './src/lib/version.ts'

const main = async (): Promise<void> => {
  const version = await injectVersion(
    fileURLToPath(new URL(versionFile, import.meta.url))
  )
  // eslint-disable-next-line no-console
  console.log(`✓ Version ${version} injected into ${versionFile}`)

  const { command } = await $`tsc --project tsconfig.version.json`
  // eslint-disable-next-line no-console
  console.log(`✓ Rebuilt with '${command}'`)
}

const injectVersion = async (path: string): Promise<string> => {
  const { version } = await readPackageJson()

  if (version == null) {
    throw new Error('Missing version in package.json')
  }

  const buff = await readFile(path)

  const data = buff
    .toString()
    .replace(
      'const seamapiReactVersion = null',
      `const seamapiReactVersion = '${version}'`
    )

  await writeFile(path, data)

  return version
}

await main()

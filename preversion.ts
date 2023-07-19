import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { $ } from 'execa'

import { readPackageJson } from './vite.config.js'

export const files = ['./README.md']

export const versionPlaceholder = '_________VERSION_________'

const main = async (): Promise<void> => {
  await Promise.all(
    files.map(async (file) => {
      const version = await injectVersionPlaceholder(
        fileURLToPath(new URL(file, import.meta.url))
      )
      // eslint-disable-next-line no-console
      console.log(`✓ Version ${version} injected into ${file}`)
      await $`git add ${file}`
    })
  )
}

const injectVersionPlaceholder = async (path: string): Promise<string> => {
  const { version } = await readPackageJson()

  if (version == null) {
    throw new Error('Missing version in package.json')
  }

  const buff = await readFile(path)
  const data = buff.toString().replaceAll(version, versionPlaceholder)
  await writeFile(path, data)
  return version
}

await main()

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import { files, versionPlaceholder } from './preversion.js'
import { readPackageJson } from './vite.config.js'

const main = async (): Promise<void> => {
  await Promise.all(
    files.map(async (file) => {
      const version = await injectVersion(
        fileURLToPath(new URL(file, import.meta.url))
      )
      // eslint-disable-next-line no-console
      console.log(`✓ Version ${version} injected into ${file}`)
    })
  )
}

const injectVersion = async (path: string): Promise<string> => {
  const { version } = await readPackageJson()

  if (version == null) {
    throw new Error('Missing version in package.json')
  }

  const buff = await readFile(path)
  const data = buff.toString().replaceAll(versionPlaceholder, version)
  await writeFile(path, data)

  return version
}

await main()

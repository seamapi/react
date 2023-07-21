import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import {
  readPackageJson,
  versionFiles,
  versionPlaceholder,
} from './vite.config.js'

const main = async (): Promise<void> => {
  await Promise.all(
    versionFiles.map(async (file) => {
      await injectVersionPlaceholder(
        fileURLToPath(new URL(file, import.meta.url))
      )
      // eslint-disable-next-line no-console
      console.log(`✓ Version placeholder injected into ${file}`)
    })
  )
}

const injectVersionPlaceholder = async (path: string): Promise<void> => {
  const { version } = await readPackageJson()

  if (version == null) {
    throw new Error('Missing version in package.json')
  }

  const buff = await readFile(path)
  const data = buff.toString().replaceAll(version, versionPlaceholder)
  await writeFile(path, data)
}

await main()

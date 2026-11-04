import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

// Size budgets for the web component bundles, in gzipped bytes (1 kB = 1000 bytes, as Vite reports).
// The ecosystem bundle is meant for marketing and product pages:
// keep it small and free of the Seam API client.
const bundles = [
  { file: 'dist/elements.js', maxGzipBytes: null },
  { file: 'dist/ecosystem.js', maxGzipBytes: 80_000 },
] as const

// Strings that only appear when the Seam API client or telemetry is bundled.
const forbiddenInEcosystem = ['connect.getseam.com']

const main = async (): Promise<void> => {
  const errors: string[] = []

  for (const { file, maxGzipBytes } of bundles) {
    const buff = await readFile(fileURLToPath(new URL(file, import.meta.url)))
    const gzipBytes = gzipSync(buff).length
    const budget =
      maxGzipBytes == null ? '' : ` (budget ${formatBytes(maxGzipBytes)})`
    // eslint-disable-next-line no-console
    console.log(
      `${file}: ${formatBytes(buff.length)} raw, ${formatBytes(gzipBytes)} gzip${budget}`
    )
    if (maxGzipBytes != null && gzipBytes > maxGzipBytes) {
      errors.push(
        `${file} is ${formatBytes(gzipBytes)} gzip, over the ${formatBytes(maxGzipBytes)} budget`
      )
    }
    if (file === 'dist/ecosystem.js') {
      const code = buff.toString()
      for (const str of forbiddenInEcosystem) {
        if (code.includes(str)) {
          errors.push(
            `${file} includes '${str}': the Seam API client or telemetry was bundled`
          )
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }
}

const formatBytes = (bytes: number): string => `${(bytes / 1000).toFixed(2)} kB`

await main()

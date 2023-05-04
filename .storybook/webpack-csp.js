import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const nonce = 'storybook'

export default class CspPlugin {
  /** @type {(compiler: import('webpack').Compiler) => void} */
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('CspPlugin', async () => {
      const index = join(compiler.outputPath, 'index.html')

      const data = await readFile(index)
      const html = data.toString()

      const output = html
        .replace('<head>', `<head>${webpackNonceScript}`)
        .replace(/<script>/g, `<script nonce="${nonce}">`)
        .replace(
          /<script type="module">/g,
          `<script type="module" nonce="${nonce}">`
        )
        .replace(/<style>/g, `<style nonce="${nonce}">`)

      await writeFile(index, output)
    })
  }
}

const webpackNonceScript = `<script nonce="${nonce}">globalThis.__webpack_nonce__ = '${nonce}'</script>`

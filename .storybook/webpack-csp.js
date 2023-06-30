import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const nonce = 'storybook'

export default class CspPlugin {
  /** @type {(compiler: import('webpack').Compiler) => void} */
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('CspPlugin', async () => {
      await Promise.all(
        ['index.html', 'iframe.html'].map(async (name) => {
          await injectNonce(join(compiler.outputPath, name))
        })
      )
    })
  }
}

const injectNonce = async (path) => {
  const data = await readFile(path)
  const html = data.toString()

  const output = html
    .replace('<head>', `<head>${webpackNonceScript}`)
    .replace(/<script>/g, `<script nonce="${nonce}">`)
    .replace(
      /<script type="module">/g,
      `<script type="module" nonce="${nonce}">`
    )
    .replace(/<style>/g, `<style nonce="${nonce}">`)

  await writeFile(path, output)
}

const webpackNonceScript = `<script nonce="${nonce}">globalThis.__webpack_nonce__ = '${nonce}'</script>`

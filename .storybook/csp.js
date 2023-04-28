import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const nonce = 'storybook'
const index = join('docs', 'index.html')

const data = await readFile(index)
const html = data.toString()

const output = html
  .replace(/<script>/g, `<script nonce="${nonce}">`)
  .replace(/<script type="module">/g, `<script type="module" nonce="${nonce}">`)
  .replace(/<style>/g, `<style nonce="${nonce}">`)

await writeFile(index, output)

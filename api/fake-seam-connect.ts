import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import type { Readable } from 'node:stream'

import {
  createFake as createFakeDevicedb,
  type Database,
  type Fake as FakeDevicedb,
} from '@seamapi/fake-devicedb'
import { createFake } from '@seamapi/fake-seam-connect'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// eslint-disable-next-line import/no-relative-parent-imports
import { seedFake } from '../.storybook/seed-fake.js'

// UPSTREAM: This line must have this precise format, otherwise
// Vercel will not include the JSON file in the deployment.
// https://github.com/vercel/next.js/discussions/14807#discussioncomment-146735
const devicedbSeed = readFileSync(
  path.join(process.cwd(), '.storybook', 'devicedb-seed.json')
)

const unproxiedHeaders = new Set([
  'content-length',
  'etag',
  'x-powered-by',
  'connection',
])

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  const { method } = req
  const { apipath, ...query } = req.query

  const fake = await createFake()
  seedFake(fake.database)

  const fakeDevicedb = await getFakeDevicedb()
  const fakeDevicedbUrl = fakeDevicedb.serverUrl
  if (fakeDevicedbUrl == null) throw new Error('Missing fake devicedb url')
  fake.database.setDevicedbConfig({
    url: fakeDevicedbUrl,
    vercelProtectionBypassSecret:
      fakeDevicedb.database.vercel_protection_bypass_secret,
  })

  const { host } = req.headers
  if (host == null) throw new Error('Missing Host header')
  await fake.startServer({ baseUrl: `https://${host}/api` })

  const body = await buffer(req)

  if (typeof apipath !== 'string') {
    throw new Error('Expected apipath to be a string')
  }

  const serverUrl = fake.serverUrl
  if (serverUrl == null) {
    throw new Error('Fake serverUrl was null')
  }

  if (method == null) {
    throw new Error('Request method undefined')
  }

  const url = new URL(apipath, serverUrl)
  for (const [k, v] of Object.entries(query)) {
    if (typeof v === 'string') url.searchParams.append(k, v)
  }

  const reqHeaders: Record<string, string> = {}
  for (const [k, v] of Object.entries(req.headers)) {
    if (k === 'content-length') continue
    if (typeof v === 'string') reqHeaders[k] = v
  }
  const proxyRes = await fetch(url, {
    redirect: 'follow',
    mode: 'cors',
    credentials: 'include',
    method,
    headers: reqHeaders,
    ...(['GET', 'HEAD', 'OPTIONS'].includes(method) ? {} : { body }),
  })

  const { status, headers } = proxyRes
  const data = await proxyRes.arrayBuffer()

  res.status(status)

  for (const [key, value] of headers) {
    if (!unproxiedHeaders.has(key)) res.setHeader(key, value)
  }

  res.end(Buffer.from(data as Buffer))

  fake.server?.close()
  fakeDevicedb.server?.close()
}

const getFakeDevicedb = async (): Promise<FakeDevicedb> => {
  const fake = await createFakeDevicedb()
  await fake.loadJSON(JSON.parse(devicedbSeed.toString()) as Database)
  await fake.startServer()
  return fake
}

const buffer = async (readable: Readable): Promise<ArrayBuffer> => {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  const buf = Buffer.concat(chunks)
  return new Uint8Array(buf).buffer
}

import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { Readable, type Stream } from 'node:stream'

import {
  createFake as createFakeDevicedb,
  type Fake as FakeDevicedb,
} from '@seamapi/fake-devicedb'
import { createFake } from '@seamapi/fake-seam-connect'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'
import getRawBody from 'raw-body'

// eslint-disable-next-line import/no-relative-parent-imports
import { seedFake } from '../.storybook/seed-fake.js'

// UPSTREAM: This line must have this precise format, otherwise
// Vercel will not include the JSON file in the deployment.
// https://github.com/vercel/next.js/discussions/14807#discussioncomment-146735
const devicedbSeed = readFileSync(
  path.join(process.cwd(), '.storybook', 'devicedb-seed.json')
)

// https://stackoverflow.com/a/44091532/559475
export const getRequestStreamFromBuffer = (requestBuffer: Buffer): Stream => {
  const requestStream = new Readable()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  requestStream._read = () => {}
  requestStream.push(requestBuffer)
  requestStream.push(null)
  return requestStream
}

const unproxiedHeaders = new Set([
  'content-length',
  'etag',
  'x-powered-by',
  'connection',
])

export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  const { apipath, ...getParams } = req.query

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

  await fake.startServer()

  const requestBuffer = await getRawBody(req)

  if (typeof apipath !== 'string') {
    throw new Error('Expected apipath to be a string')
  }

  const { status, data, headers } = await axios.request({
    url: `${fake.serverUrl}/${apipath}`,
    params: getParams,
    method: req.method,
    headers: { ...req.headers },
    data: getRequestStreamFromBuffer(requestBuffer),
    timeout: 10_000,
    validateStatus: () => true,
    maxRedirects: 0,
  })

  res.status(status)

  for (const [key, value] of Object.entries(headers)) {
    if (unproxiedHeaders.has(key)) res.setHeader(key, value)
  }

  if (typeof data === 'string') {
    res.end(data)
  } else {
    res.json(data)
  }

  fake.server?.close()
  fakeDevicedb.server?.close()
}

const getFakeDevicedb = async (): Promise<FakeDevicedb> => {
  const fake = await createFakeDevicedb()
  await fake.loadJSON(JSON.parse(devicedbSeed.toString()))
  await fake.startServer()
  return fake
}

export const config = {
  api: {
    bodyParser: false,
  },
}

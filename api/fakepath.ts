import { Readable } from 'node:stream'

import * as FakeSC from '@seamapi/fake-seam-connect'
import axios from 'axios'
import getRawBody from 'raw-body'

import { seedFake } from '../.storybook/seed-fake.js'

// Taken from seam-connect
// Based on: https://stackoverflow.com/a/44091532/559475
export const getRequestStreamFromBuffer = (requestBuffer: Buffer) => {
  const requestStream = new Readable()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  requestStream._read = () => {}
  requestStream.push(requestBuffer)
  requestStream.push(null)
  return requestStream
}

const dontProxyHeaders = new Set([
  'content-length',
  'etag',
  'x-powered-by',
  'connection',
])

export default async (req: any, res: any) => {
  const { fakepath, ...getParams } = req.query

  const fake = await FakeSC.create()

  const server = await fake.startServer()

  seedFake((fake.database as any).getState())

  const requestBuffer = await getRawBody(req)

  const proxyRes = await axios.request({
    url: `${server.serverUrl}/${fakepath as string}`,
    params: getParams,
    method: req.method,
    headers: { ...req.headers },
    data: getRequestStreamFromBuffer(requestBuffer),
    timeout: 10_000,
    validateStatus: () => true, // accept all responses
    maxRedirects: 0,
  })

  fake.stopServer()

  // TODO save modified state
  // const modified_state = fake.toJSON()

  res.status(proxyRes.status)
  for (const [headerKey, headerVal] of Object.entries(proxyRes.headers)) {
    if (dontProxyHeaders.has(headerKey)) continue
    res.setHeader(headerKey, headerVal)
  }
  if (typeof proxyRes.data === 'string') {
    res.end(proxyRes.data)
  } else {
    res.json(proxyRes.data)
  }
  server.close()
}

export const config = {
  api: {
    bodyParser: false,
  },
}

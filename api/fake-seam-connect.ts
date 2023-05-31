import type { IncomingMessage, ServerResponse } from 'node:http'
import { Readable, type Stream } from 'node:stream'

import { create as createFake } from '@seamapi/fake-seam-connect'
import axios from 'axios'
import getRawBody from 'raw-body'

import { seedFake } from '../.storybook/seed-fake.js'

// Taken from seam-connect
// Based on: https://stackoverflow.com/a/44091532/559475
export const getRequestStreamFromBuffer = (requestBuffer: Buffer): Stream => {
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

interface NextApiRequest extends IncomingMessage {
  query: Partial<Record<string, string | string[]>>
}

interface NextApiResponse extends ServerResponse {
  json: (body: object) => void
  status: (statusCode: number) => NextApiResponse
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { apipath, ...getParams } = req.query

  const fake = await createFake()

  const server = await fake.startServer()

  seedFake(fake.database)

  const requestBuffer = await getRawBody(req)

  if (typeof apipath !== 'string') {
    throw new Error('Expected apipath to be a string')
  }

  const proxyRes = await axios.request({
    url: `${server.serverUrl}/${apipath}`,
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

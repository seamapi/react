import type { VercelRequest, VercelResponse } from '@vercel/node'

// eslint-disable-next-line import/no-relative-parent-imports
import { handleFakeEcosystemRequest } from '../.storybook/fake-ecosystem.js'

// Serves the fake Seam Ecosystem API on react.seam.co at /api/ecosystem/*
// (see the rewrite in vercel.json), so the Storybook never needs a real embed key.
export default async (
  req: VercelRequest,
  res: VercelResponse
): Promise<void> => {
  const { ecosystempath, ...query } = req.query

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    for (const v of Array.isArray(value) ? value : [value]) {
      searchParams.append(key, v)
    }
  }

  const headers: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(req.headers)) {
    headers[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : value
  }

  const {
    status,
    headers: resHeaders,
    body,
  } = handleFakeEcosystemRequest({
    method: req.method ?? 'GET',
    path: Array.isArray(ecosystempath)
      ? ecosystempath.join('/')
      : (ecosystempath ?? ''),
    searchParams,
    headers,
    assetBaseUrl: '/api/ecosystem',
  })

  res.status(status)
  for (const [key, value] of Object.entries(resHeaders)) {
    res.setHeader(key, value)
  }
  res.end(body ?? undefined)
}

import 'isomorphic-fetch'

beforeAll(async () => {
  const endpoint = globalThis.TEST_SEAM_ENDPOINT
  const res = await fetch(`${endpoint}/health`)
  if (!res.ok) throw new Error('Fake Seam Connect unhealthy')
})

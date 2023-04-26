beforeAll(async () => {
  const endpoint = 'http://localhost:9000'
  const res = await fetch(`${endpoint}/health`)
  if (!res.ok) throw new Error('Fake Seam Connect unhealthy')
})

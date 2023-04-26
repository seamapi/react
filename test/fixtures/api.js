import process from 'node:process'

import { create } from '@seamapi/fake-seam-connect'

const fake = await create()
await fake.startServer(9000)
console.log(`Fake Seam Connect listening on ${fake.server.serverUrl}`)
process.on('SIGTERM', () => {
  console.log('xxx')
  process.exit(0)
})

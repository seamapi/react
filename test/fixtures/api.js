import { create } from '@seamapi/fake-seam-connect'

const fake = await create()
await fake.startServer(9000)
// eslint-disable-next-line no-console
console.log(`Fake Seam Connect listening on ${fake.server.serverUrl}`)

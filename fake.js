import { create } from '@seamapi/fake-seam-connect'

const fake = await create()
await fake.startServer(9000)

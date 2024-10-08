import { fileURLToPath } from 'node:url'

import {
  createFake,
  type Database,
  seedDatabaseFromApi,
} from '@seamapi/fake-devicedb'
import { SeamHttp } from '@seamapi/http/connect'
import { writeFile } from 'fs/promises'

const main = async (): Promise<void> => {
  const publishableKey = 'seam_pk1J0Bgui_oYEuzDhOqUzSBkrPmrNsUuKL'
  const userIdentifierKey = ' 7ff81ed1-51d4-4e77-9c8d-6f2b8ff8fc35'

  const fake = await createFake()
  await seedDatabase(fake.database, publishableKey, userIdentifierKey)

  const json = await fake.toJSON()

  await writeFile(
    fileURLToPath(new URL('devicedb-seed.json', import.meta.url)),
    JSON.stringify(json, null, 2)
  )
}

const seedDatabase = async (
  db: Database,
  publishableKey: string,
  userIdentifierKey: string
): Promise<void> => {
  const seam = await SeamHttp.fromPublishableKey(
    publishableKey,
    userIdentifierKey
  )
  const baseURL = seam.client.defaults.baseURL

  seam.client.defaults.baseURL = new URL(
    '/internal/devicedb',
    baseURL
  ).toString()

  await seedDatabaseFromApi(db, seam.client)
}

await main()

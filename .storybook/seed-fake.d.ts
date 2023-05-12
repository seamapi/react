import type { Database } from '@seamapi/fake-seam-connect'

declare function seedFake(db: Database): void

declare const fakePublishableKey: string
declare const fakeUserIdentifierKey: string

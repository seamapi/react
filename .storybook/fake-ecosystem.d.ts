import type { IncomingMessage, ServerResponse } from 'node:http'

export declare const fakeEmbedKey: string
export declare const fakePartnerEmbedKey: string
export declare const fakeManufacturerEmbedKey: string
export declare const fakeWrongOriginEmbedKey: string
export declare const fakeInvalidEmbedKey: string

export interface FakeEcosystemRequest {
  method: string
  path: string
  searchParams: URLSearchParams
  headers: Record<string, string | undefined>
  assetBaseUrl: string
}

export interface FakeEcosystemResponse {
  status: number
  headers: Record<string, string>
  body: string | null
}

export declare function handleFakeEcosystemRequest(
  request: FakeEcosystemRequest
): FakeEcosystemResponse

export declare function createFakeEcosystemMiddleware(options: {
  assetBaseUrl: string
}): (req: IncomingMessage, res: ServerResponse) => void

export interface FakeEcosystemServer {
  serverUrl: string
  endpoint: string
  close: () => Promise<void>
}

export declare function startFakeEcosystemServer(): Promise<FakeEcosystemServer>

interface SeamClientOptions {
  publishableKey?: string
  sessionKey?: string
  endpoint?: string
}

export class Seam {
  #clientSessionId?: string
  #publishableKey
  #sessionKey
  #endpoint

  constructor({ publishableKey, sessionKey, endpoint }: SeamClientOptions) {
    this.#publishableKey = publishableKey
    this.#sessionKey = sessionKey
    this.#endpoint = endpoint ?? 'https://seam.example.com'
  }

  async useClientSession(): Promise<void> {
    if (this.#publishableKey == null) {
      throw new Error('Missing publishableKey')
    }

    this.#sessionKey ??= 'default-session-key'

    this.#clientSessionId = [
      'mock-client-session-id',
      this.#endpoint,
      this.#publishableKey,
      this.#sessionKey
    ].join('_')
  }

  devices = {
    list: async (): Promise<Device[]> => {
      if (this.#clientSessionId == null) {
        throw new Error('No client session')
      }
      return devices
    }
  }
}

export interface SeamError extends Error {}

export interface Device {
  device_id: string
  manufacturer: string
}

const devices = [
  { device_id: '1', manufacturer: 'august' },
  { device_id: '2', manufacturer: 'yale' }
]

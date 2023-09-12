import Queue from 'queue'

export interface TelemetryClientOptions {
  endpoint?: string
  debug?: boolean
  disabled?: boolean
}

// Implements a compatible Analytics 2.0 API with custom options.
// https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/
export class TelemetryClient {
  #queue: Queue

  #endpoint: string
  #debug: boolean
  #disabled: boolean

  #loaded: boolean = false
  #user: User | null = null

  constructor({
    endpoint = 'https://connect.getseam.com/_tlmtry',
    debug = false,
    disabled = false,
  }: TelemetryClientOptions = {}) {
    this.#queue = new Queue()
    this.#endpoint = endpoint
    this.#debug = debug
    this.#disabled = disabled
  }

  load({ endpoint, debug, disabled }: TelemetryClientOptions = {}): void {
    this.#log('load', { endpoint, debug, disabled })
    if (this.#loaded) {
      throw new Error(
        'TelemetryClient already loaded. Call TelemetryClient.reset() first.'
      )
    }
    if (endpoint != null) this.#endpoint = endpoint
    if (debug != null) this.#debug = debug
    if (disabled != null) this.#disabled = disabled
    this.#queue.start((err) => {
      // eslint-disable-next-line no-console
      if (err != null && this.#debug) console.error(err)
    })
    this.#loaded = true
  }

  reset(): void {
    this.#log('reset')
    this.#queue.end()
    this.#user = null
    this.#loaded = false
  }

  debug(debug?: boolean): boolean {
    if (debug != null) this.#debug = debug
    return this.#debug
  }

  identify(userId: string, traits: TelemetryRecord = {}): void {
    this.#log('identify', userId, traits)
    if (this.#user?.userId !== userId) {
      this.#user = { userId, traits: {} }
    }
    this.#user = {
      userId,
      traits: {
        ...(this.#user?.traits ?? {}),
        ...traits,
      },
    }
    this.#push({
      type: 'identify',
      userId: this.#user.userId,
      traits: this.#user.traits,
    })
  }

  track(event: string, properties: TelemetryRecord = {}): void {
    this.#log('track', event, properties)
    this.#push({ type: 'track', event, properties })
  }

  #push = (message: QueueMessage): void => {
    if (this.#disabled) return
    this.#queue.push(async () => {
      const user = this.#user
      if (user === null) return
      const payload: Payload = { ...message, user }
      const response = await fetch(this.#endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        throw new Error(
          `Telemetry request failed with ${response.status} ${response.statusText}`
        )
      }
    })
  }

  #log = (method: string, ...args: Array<string | TelemetryRecord>): void => {
    if (!this.#debug) return
    const strArgs =
      args.length > 0 ? args.map((arg) => JSON.stringify(arg)).join(', ') : ''
    // eslint-disable-next-line no-console
    console.log(`TelemetryClient.${method}(${strArgs})`)
  }
}

type TelemetryRecord = Record<
  string,
  string | number | boolean | null | undefined
>

type QueueMessage = IdentifyMessage | TrackMessage

interface IdentifyMessage {
  type: 'identify'
  userId: string
  traits: TelemetryRecord
}

interface TrackMessage {
  type: 'track'
  event: string
  properties: TelemetryRecord
}

type Payload = QueueMessage & {
  user: User
}

interface User {
  userId: string
  traits: TelemetryRecord
}

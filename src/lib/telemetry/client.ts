import type Queue from 'queue'

export interface TelemetryClientOptions {
  queue: Queue
  endpoint?: string
  debug?: boolean
}

export class TelemetryClient {
  #queue: Queue
  #endpoint: string
  #loaded: boolean = false
  #debug: boolean
  #user: {
    userId: string
    traits: TelemetryRecord
  } | null = null

  constructor({
    queue,
    endpoint = 'https://react.seam.co/_tlmtry',
    debug = false,
  }: TelemetryClientOptions) {
    this.#queue = queue
    this.#endpoint = endpoint
    this.#debug = debug
  }

  identify(userId: string, traits: TelemetryRecord = {}): void {
    this.#user = { userId, traits }
    this.#push({
      type: 'identify',
      userId: this.#user.userId,
      traits: this.#user.traits,
    })
  }

  track(event: string, properties: TelemetryRecord = {}): void {
    this.#push({ type: 'track', event, properties })
  }

  load(): void {
    if (this.#loaded) return
    this.#loaded = true
    void this.#queue.start()
    this.#log('Loaded')
  }

  #push = (message: QueueMessage): void => {
    this.#queue.push(async () => {
      const response = await fetch(this.#endpoint, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) {
        throw new Error(
          `Telemetry request failed with ${response.status} ${response.statusText}`
        )
      }
    })
  }

  #log = (message: string, ...data: TelemetryRecord[]): void => {
    if (!this.#debug) return
    // eslint-disable-next-line no-console
    console.log(
      `TelemetryClient: ${message}`,
      data == null ? undefined : JSON.stringify(data)
    )
  }
}

export class NoopTelemetryClient implements GenericTelemetryClient {
  #debug: boolean
  #loaded: boolean = false

  constructor({ debug = false }: Pick<TelemetryClientOptions, 'debug'> = {}) {
    this.#debug = debug
  }

  identify(userId: string, traits: TelemetryRecord = {}): void {
    this.#log('identify', userId, traits)
  }

  track(event: string, properties: TelemetryRecord = {}): void {
    this.#log('track', event, properties)
  }

  load(): void {
    if (this.#loaded) return
    this.#loaded = true
    this.#log('load')
  }

  #log = (method: string, ...args: Array<string | TelemetryRecord>): void => {
    if (!this.#debug) return
    const strArgs =
      args.length === 0 ? args.map((arg) => JSON.stringify(arg)).join(', ') : ''
    // eslint-disable-next-line no-console
    console.log(`NoopTelemetryClient.${method}(${strArgs})`)
  }
}

// UPSTREAM: Otherwise, implementing TypeScript classes requires implementing private members.
// https://github.com/microsoft/TypeScript/issues/18499#issuecomment-429272545
export type GenericTelemetryClient = Public<TelemetryClient>
type Public<T> = { [P in keyof T]: T[P] }

type TelemetryRecord = Record<string, string | number | boolean | null>

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

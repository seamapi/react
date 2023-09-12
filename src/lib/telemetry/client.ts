import Queue from 'queue'
import { v4 as uuidv4 } from 'uuid'

import version from 'lib/version.js'

export interface TelemetryClientOptions {
  endpoint?: string
  debug?: boolean
  disabled?: boolean
}

// Implements a compatible Analytics 2.0 API with custom options.
// https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/
export class TelemetryClient {
  #queue: Queue
  #anonymousId: string | null

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
    this.#anonymousId = uuidv4()
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
    this.#anonymousId = uuidv4()
    this.#user = null
    this.#loaded = false
  }

  debug(debug?: boolean): boolean {
    if (debug != null) this.#debug = debug
    return this.#debug
  }

  identify(userId: string, traits: Traits = {}): void {
    this.#log('identify', userId, traits)
    this.#anonymousId = null
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
      traits: this.#user.traits,
    })
  }

  track(event: string, properties: Properties = {}): void {
    this.#log('track', event, properties)
    this.#push({ type: 'track', event, properties })
  }

  get #context(): Context {
    const name =
      globalThis.seamCustomElementNames?.length === 0
        ? '@seamapi/react'
        : '@seamapi/react/elements'
    return {
      ...(this.#user?.traits == null ? {} : { traits: this.#user.traits }),
      app: {
        name,
        version: version ?? undefined,
      },
    }
  }

  #push = (message: Message): void => {
    if (this.#disabled) return
    this.#queue.push(async () => {
      const payload: Payload = {
        ...message,
        userId: this.#user?.userId ?? undefined,
        anonymousId: this.#anonymousId ?? undefined,
        messageId: uuidv4(),
        timestamp: new Date().toISOString(),
        context: this.#context,
      }
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

  #log = (
    method: string,
    ...args: Array<string | Traits | Properties>
  ): void => {
    if (!this.#debug) return
    const strArgs =
      args.length > 0 ? args.map((arg) => JSON.stringify(arg)).join(', ') : ''
    // eslint-disable-next-line no-console
    console.log(`TelemetryClient.${method}(${strArgs})`)
  }
}

// https://segment.com/docs/connections/spec/track/
interface TrackSpec {
  type: 'track'
  event: string
  properties: Properties
}

// https://segment.com/docs/connections/spec/identify/
interface IdentifySpec {
  type: 'identify'
  traits: Traits
}

// https://segment.com/docs/connections/spec/common/
interface CommonSpec {
  anonymousId: string | undefined
  userId: string | undefined
  messageId: string
  timestamp: string
  context: Context
}

// https://segment.com/docs/connections/spec/common/#context
interface Context {
  traits?: Traits
  app: {
    name: string
    version: string | undefined
  }
}

interface User {
  userId: string
  traits: Traits
}

type Payload = Message & CommonSpec

type Message = IdentifySpec | TrackSpec

type Traits = TelemetryRecord

type Properties = TelemetryRecord

type TelemetryRecord = Record<
  string,
  string | number | boolean | null | undefined
>

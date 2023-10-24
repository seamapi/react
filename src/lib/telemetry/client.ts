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
  readonly #queue: Queue
  #anonymousId: string | null

  #endpoint: string
  #debug: boolean
  #disabled: boolean

  #loaded: boolean = false
  #user: User | null = null

  constructor({
    endpoint = 'https://connect.getseam.com',
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
    this.#queue.autostart = true
    this.#queue.start((err) => {
      // eslint-disable-next-line no-console
      if (err != null && this.#debug) console.error(err)
    })
    this.#loaded = true
  }

  reset(): void {
    this.#log('reset')
    this.#queue.autostart = false
    this.#queue.end()
    this.#anonymousId = uuidv4()
    this.#user = null
    this.#loaded = false
  }

  debug(debug?: boolean): boolean {
    if (debug != null) this.#debug = debug
    return this.#debug
  }

  page(name: string, properties: Properties = {}): void {
    this.#log('page', name, properties)
    this.#push({ type: 'page', name, properties })
  }

  screen(name: string, properties: Properties = {}): void {
    this.#log('screen', name, properties)
    this.#push({ type: 'screen', name, properties })
  }

  track(event: string, properties: Properties = {}): void {
    this.#log('track', event, properties)
    this.#push({ type: 'track', event, properties })
  }

  group(groupId: string, traits: Traits = {}): void {
    this.#log('group', groupId, traits)
    this.#push({
      type: 'group',
      groupId,
      traits,
    })
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
      userId,
      traits: this.#user.traits,
    })
  }

  alias(userId: string, previousId?: string): void {
    const resolvedPreviousId =
      previousId ?? this.#user?.userId ?? this.#anonymousId
    if (resolvedPreviousId == null) {
      throw new Error('Cannot resolve previous id')
    }
    this.#log('alias', userId, resolvedPreviousId)
    this.#push({
      type: 'alias',
      userId,
      previousId: resolvedPreviousId,
      anonymousId: undefined,
    })
  }

  get #context(): Context {
    return {
      traits: this.#user?.traits ?? undefined,
      locale: globalThis.navigator?.language ?? undefined,
      timezone:
        Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone ?? undefined,
      userAgent: globalThis.navigator?.userAgent ?? undefined,
      screen: {
        width: globalThis.screen?.width ?? undefined,
        height: globalThis.screen?.height ?? undefined,
        density:
          globalThis.devicePixelRatio != null
            ? Math.round(globalThis.devicePixelRatio * 100) / 100
            : undefined,
      },
      library: {
        version: version ?? undefined,
        name:
          // Assume if one of the elements is defined then this is loaded inside a web component.
          // This method will be inaccurate if the element bundle is loaded alongside
          // an app using the React components, however this use case is unlikely.
          // Choose seam-device-details as this component is unlikely to ever be removed.
          globalThis.customElements?.get('seam-device-details') != null
            ? '@seamapi/react/elements'
            : '@seamapi/react',
      },
    }
  }

  readonly #push = (message: Message): void => {
    if (this.#disabled) return
    this.#queue.push(async () => {
      const payload: Payload = {
        userId: this.#user?.userId ?? undefined,
        anonymousId: this.#anonymousId ?? undefined,
        ...message,
        messageId: uuidv4(),
        timestamp: new Date().toISOString(),
        context: this.#context,
      }
      const response = await fetch(`${this.#endpoint}/internal/tlmtry`, {
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

  readonly #log = (
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

// https://segment.com/docs/connections/spec/screen/
interface PageSpec {
  type: 'page'
  name: string
  properties: Properties
}

// https://segment.com/docs/connections/spec/screen/
interface ScreenSpec {
  type: 'screen'
  name: string
  properties: Properties
}

// https://segment.com/docs/connections/spec/track/
interface TrackSpec {
  type: 'track'
  event: string
  properties: Properties
}

// https://segment.com/docs/connections/spec/group/
interface GroupSpec {
  type: 'group'
  groupId: string
  traits: Traits
}

// https://segment.com/docs/connections/spec/identify/
interface IdentifySpec {
  type: 'identify'
  userId: string
  traits: Traits
}

// https://segment.com/docs/connections/spec/alias/
interface AliasSpec {
  type: 'alias'
  userId: string
  previousId: string
  anonymousId: undefined
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
  locale?: string
  // According to the Common Spec this is timezone and not timeZone.
  timezone?: string
  userAgent?: string
  userAgentData?: string
  screen: {
    width?: number
    height?: number
    density?: number
  }
  library: {
    name: string
    version: string | undefined
  }
}

interface User {
  userId: string
  traits: Traits
}

type Payload = Omit<Message, 'userId'> & CommonSpec

type Message =
  | PageSpec
  | ScreenSpec
  | TrackSpec
  | GroupSpec
  | IdentifySpec
  | AliasSpec

type Traits = TelemetryRecord

type Properties = TelemetryRecord

type TelemetryRecord = Record<
  string,
  string | number | boolean | null | undefined
>

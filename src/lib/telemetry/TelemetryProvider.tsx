import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react'

import {
  type GenericTelemetryClient,
  NoopTelemetryClient,
  TelemetryClient,
  TelemetryQueue,
} from 'lib/telemetry/client.js'

export interface TelemetryContext {
  client: GenericTelemetryClient
}

export interface TelemetryProviderProps extends PropsWithChildren {
  queue?: TelemetryQueue
  endpoint?: string
  debug?: boolean
}

const defaultQueue = new TelemetryQueue()

export function TelemetryProvider({
  children,
  ...props
}: TelemetryProviderProps): JSX.Element {
  const value = useMemo(() => {
    return createTelemetryContextValue(props)
  }, [props])

  if (value.client == null) {
    throw new Error(`Must provide a Telemetry client.`)
  }

  const { Provider } = telemetryContext

  return <Provider value={value}>{children}</Provider>
}

const createTelemetryContextValue = ({
  queue,
  ...options
}: TelemetryProviderProps): TelemetryContext => {
  return {
    client: new TelemetryClient({
      ...options,
      queue: queue ?? defaultQueue,
    }),
  }
}

export const telemetryContext = createContext<TelemetryContext>({
  client: new NoopTelemetryClient(),
})

export function useTelemetryContext(): TelemetryContext {
  return useContext(telemetryContext)
}

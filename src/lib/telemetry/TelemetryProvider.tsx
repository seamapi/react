import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react'

import { TelemetryClient } from './client.js'

export interface TelemetryContext {
  client: TelemetryClient
}

export interface TelemetryProviderProps extends PropsWithChildren {
  disabled?: boolean
  client?: TelemetryClient
  endpoint?: string
  debug?: boolean
}

export function TelemetryProvider({
  children,
  client,
  ...props
}: TelemetryProviderProps): JSX.Element {
  const value = useMemo(() => {
    return { client: client ?? new TelemetryClient(props) }
  }, [client, props])

  useEffect(() => {
    value.client.load(props)
    return () => {
      value.client.reset()
    }
  }, [props, value])

  if (value.client == null) {
    throw new Error(`Must provide a Telemetry client.`)
  }

  const { Provider } = telemetryContext

  return <Provider value={value}>{children}</Provider>
}

export const telemetryContext = createContext<TelemetryContext>({
  client: new TelemetryClient(),
})

export function useTelemetryContext(): TelemetryContext {
  return useContext(telemetryContext)
}

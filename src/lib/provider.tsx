"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, type ReactElement, type ReactNode, useRef } from 'react'
import type { Seam, SeamClientOptions } from 'seamapi'

declare global {
  // eslint-disable-next-line no-var
  var seam: Omit<SeamProviderProps, 'children'> | undefined
}

export interface SeamContext {
  client: Seam | null
  clientOptions?: SeamClientOptions | undefined
  publishableKey?: string | undefined
  userIdentifierKey?: string | undefined
}

export interface SeamProviderProps {
  client?: Seam
  publishableKey?: string
  userIdentifierKey?: string
  endpoint?: string
  children?: ReactNode
}

export function SeamProvider({
  children,
  ...props
}: SeamProviderProps): ReactElement {
  const { Provider } = seamContext

  const queryClientRef = useRef(new QueryClient())

  const contextRef = useRef(createSeamContextValue(props))
  if (
    contextRef.current.client == null &&
    contextRef.current.publishableKey == null
  ) {
    contextRef.current = defaultSeamContextValue
  }

  if (
    contextRef.current.client == null &&
    contextRef.current.publishableKey == null
  ) {
    throw new Error('Must provide either a Seam client or a publishableKey.')
  }

  return (
    <div className='seam-components'>
      <QueryClientProvider client={queryClientRef.current}>
        <Provider value={{ ...contextRef.current }}>{children}</Provider>
      </QueryClientProvider>
    </div>
  )
}

const createDefaultSeamContextValue = (): SeamContext => {
  if (
    globalThis.seam?.client == null &&
    globalThis.seam?.publishableKey == null
  ) {
    return { client: null }
  }

  try {
    return createSeamContextValue(globalThis.seam)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err)
    return { client: null }
  }
}

const createSeamContextValue = ({
  client,
  ...options
}: Omit<SeamProviderProps, 'children'>): SeamContext => {
  if (client == null && Object.keys(options).length === 0) {
    return { client: null }
  }

  if (client != null && Object.values(options).some((v) => v == null)) {
    throw new Error(
      'Cannot provide both a Seam client along with other options.'
    )
  }

  const { publishableKey, userIdentifierKey, ...clientOptions } = options

  if (client != null) {
    return { client }
  }

  return {
    client: null,
    publishableKey,
    userIdentifierKey,
    clientOptions,
  }
}

const defaultSeamContextValue = createDefaultSeamContextValue()

export const seamContext = createContext<SeamContext>(defaultSeamContextValue)

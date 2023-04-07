import { createContext, ReactNode } from 'react'
import React from 'react'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient()

export type SeamContextType = {
  pubKey?: string
  clientAccessToken?: string
  seamEndpoint: string
  userIdentifierKey: string
}

export const SeamContext = createContext<SeamContextType>({
  pubKey: '',
  clientAccessToken: '',
  seamEndpoint: '',
  userIdentifierKey: '',
})

type Props = {
  children?: ReactNode
}

export default function SeamProvider({
  children,
  pubKey,
  clientAccessToken,
  seamEndpoint,
  userIdentifierKey,
}: Props & SeamContextType) {
  return (
    <SeamContext.Provider value={{ pubKey, clientAccessToken, seamEndpoint, userIdentifierKey }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SeamContext.Provider>
  )
}

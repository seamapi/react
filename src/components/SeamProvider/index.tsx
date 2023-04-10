import { createContext, ReactNode } from 'react'
import React from 'react'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient()

export type SeamContextType = {
  publishedKey?: string
  clientSessionToken?: string
  seamEndpoint: string
  userIdentifierKey: string
}

export const SeamContext = createContext<SeamContextType>({
  publishedKey: '',
  clientSessionToken: '',
  seamEndpoint: '',
  userIdentifierKey: '',
})

type Props = {
  children?: ReactNode
}

export default function SeamProvider({
  children,
  publishedKey,
  clientSessionToken,
  seamEndpoint,
  userIdentifierKey,
}: Props & SeamContextType) {
  return (
    <SeamContext.Provider value={{ publishedKey, clientSessionToken, seamEndpoint, userIdentifierKey }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SeamContext.Provider>
  )
}

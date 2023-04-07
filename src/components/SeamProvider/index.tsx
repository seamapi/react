import { createContext, ReactNode } from 'react'
import React from 'react'

export type SeamContextType = {
  pubKey?: string
  clientAccessToken?: string
  seamEndpoint: string
}

export const SeamContext = createContext<SeamContextType>({
  pubKey: '',
  clientAccessToken: '',
  seamEndpoint: '',
})

type Props = {
  children?: ReactNode
}

export default function SeamProvider({
  children,
  pubKey,
  clientAccessToken,
  seamEndpoint,
}: Props & SeamContextType) {
  return (
    <SeamContext.Provider value={{ pubKey, clientAccessToken, seamEndpoint }}>
      {children}
    </SeamContext.Provider>
  )
}

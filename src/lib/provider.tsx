import { createContext, type ReactNode, useContext } from 'react'
import { Seam } from 'seamapi'

declare global {
  // eslint-disable-next-line no-var
  var seam: Props | undefined
}

export interface SeamContext {
  client: Seam
}

export function useSeam(): SeamContext {
  return useContext(seamContext)
}

interface Props {
  client?: Seam
  publishableKey?: string
  sessionKey?: string
  endpoint?: string
  children?: ReactNode
}

export function SeamProvider({ client, children, ...props }: Props): ReactNode {
  const { Provider } = seamContext

  if (client == null && Object.keys(props).length > 0) {
    throw new Error(
      'Must provide a Seam client or a publishableKey and a sessionKey.'
    )
  }

  if (client != null && Object.values(props).some((v) => v == null)) {
    throw new Error(
      'Cannot provide a Seam client along with a publishableKey, sessionKey or endpoint.'
    )
  }

  return (
    <Provider value={{ client: client ?? new Seam(props) }}>
      {children}
    </Provider>
  )
}

const defaultClient =
  globalThis.seam?.client ??
  new Seam({
    // @ts-expect-error Client sessions not yet implemented in SDK.
    publishableKey: globalThis.seam?.publishableKey,
    sessionKey: globalThis.seam?.sessionKey,
    endpoint: globalThis.seam?.endpoint
  })

const seamContext = createContext<SeamContext>({
  client: defaultClient
})

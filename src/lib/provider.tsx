import { createContext, type ReactNode, useContext } from 'react'
import { Seam } from 'seamapi'

declare global {
  // eslint-disable-next-line no-var
  var seam: Omit<Props, 'children'> | undefined
}

export interface SeamContext {
  client: Seam | null
}

export function useSeam(): Seam {
  const { client } = useContext(seamContext)
  if (client == null) {
    throw new Error('Must useSeam inside a SeamProvider.')
  }
  return client
}

interface Props {
  client?: Seam
  publishableKey?: string
  sessionKey?: string
  endpoint?: string
  children?: ReactNode
}

export function SeamProvider({ children, ...props }: Props): ReactNode {
  const { Provider } = seamContext
  return <Provider value={{ client: getClient(props) }}>{children}</Provider>
}

const getClient = ({ client, ...options }: Omit<Props, 'children'>): Seam => {
  if (client != null && Object.values(options).some((v) => v == null)) {
    throw new Error(
      'Cannot provide both a Seam client along with a publishableKey, sessionKey, or endpoint.'
    )
  }

  if (client == null && Object.keys(options).length > 0) {
    throw new Error(
      'Must provide either a Seam client or a publishableKey and a sessionKey.'
    )
  }

  return client ?? new Seam(options)
}

const seamContext = createContext<SeamContext>({
  client: globalThis.seam == null ? null : getClient(globalThis.seam)
})

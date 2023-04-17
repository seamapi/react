import Seam from 'seamapi'
import { getCookie, setCookie } from '../utils'

export const useSeamClient = ({
  publishedKey,
  endpoint,
  userIdentifierKey,
  clientSessionToken,
}: {
  publishedKey?: string
  endpoint: string
  userIdentifierKey: string
  clientSessionToken?: string
}): Seam => {
  if (typeof window === 'undefined') return null as any
  if (!endpoint) throw new Error('No endpoint provided')
  const getSeam = (token: string) => {
    return new Seam({
      clientSessionToken: token,
      endpoint,
    })
  }
  const clientSessionTokenFromCookie = getCookie(`seam-clientSessionToken-${userIdentifierKey}`)
  // if clientSessionToken is provided, use it, no need to check cookie or public key (create new client access token)
  if (clientSessionToken?.startsWith('seam_cst')) {
    // backend generated client access token
    setCookie(`seam-clientSessionToken-${userIdentifierKey}`, clientSessionToken, 30)
    return getSeam(clientSessionToken)
  } else if (clientSessionTokenFromCookie) {
    // already have client access token from cookie
    // no need to use public key
    // TODO: check if client access token is valid (not expired), if expired/invalid, get new one with the public key
    return getSeam(clientSessionTokenFromCookie)
  } else if (publishedKey?.startsWith('seam_pk1')) {
    // public key, need to create a client access token and store it in cookie
    ;(async () => {
      const clientSessionTokenResponse = await Seam.getClientSessionToken({ publishedKey, userIdentifierKey, endpoint })
      if (clientSessionTokenResponse.ok === false || !clientSessionTokenResponse['client_session']) {
        throw new Error('Could not get client access token')
      }
      const clientSessionToken = clientSessionTokenResponse?.client_session?.token
      if (!clientSessionToken) {
        throw new Error('Could not get client access token')
      }
      setCookie(`seam-clientSessionToken-${userIdentifierKey}`, clientSessionToken, 30)
      return getSeam(clientSessionToken)
      // TODO: improve: use devices are not loading probably due to async nature of this hook
    })()
  } else {
    throw new Error('No publishedKey nor clientSessionToken provided or they are invalid')
    return null as any
  }
  return null as any
}

export default useSeamClient

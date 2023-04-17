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

  const clientSessionTokenFromCookie = getCookie(`seam-clientSessionToken-${userIdentifierKey}`)
  // if clientSessionToken is provided, use it, no need to check cookie or public key (create new client access token)
  if (clientSessionToken?.startsWith('seam_cst')) {
    // backend generated client access token
    setCookie(`seam-clientSessionToken-${userIdentifierKey}`, clientSessionToken, 30)
    const seam = new Seam({
      clientSessionToken: clientSessionToken,
      endpoint,
    })
    return seam
  } else if (clientSessionTokenFromCookie) {
    // already have client access token from cookie
    // no need to use public key
    const seam = new Seam({
      clientSessionToken: clientSessionTokenFromCookie,
      endpoint,
    })
    // TODO: check if client access token is valid (not expired), if expired/invalid, get new one with the public key
    return seam
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
      const seam = new Seam({
        clientSessionToken: clientSessionToken,
        endpoint: endpoint,
      })
      return seam
      // TODO: improve: use devices are not loading probably due to async nature of this hook
    })()
  } else {
    throw new Error('No publishedKey nor clientSessionToken provided or they are invalid')
    return null as any
  }
  return null as any
}

export default useSeamClient

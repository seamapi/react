import Seam from 'seamapi'
import { getCookie, setCookie } from '../utils'

export const useSeamClient = ({
  pubKey,
  endpoint,
  userIdentifierKey,
  clientAccessToken,
}: {
  pubKey?: string
  endpoint: string
  userIdentifierKey: string
  clientAccessToken?: string
}): Seam => {
  if (typeof window === 'undefined') return null as any

  const clientAccessTokenFromCookie = getCookie(`seam-clientAccessToken-${userIdentifierKey}`)
  // if clientAccessToken is provided, use it, no need to check cookie or public key (create new client access token)
  if (clientAccessToken?.startsWith('seam_cat')) {
     // backend generated client access token
     setCookie(`seam-clientAccessToken-${userIdentifierKey}`, clientAccessToken, 30)
     const seam = new Seam({
       apiKey: clientAccessToken,
       endpoint,
     })
     return seam
  } else if (clientAccessTokenFromCookie) {
    // already have client access token from cookie
    // no need to use public key
    const seam = new Seam({
      apiKey: clientAccessTokenFromCookie,
      endpoint,
    })
    // TODO: check if client access token is valid (not expired), if expired/invalid, get new one with the public key
    return seam
  } else if (pubKey?.startsWith('seam_pk1')) {
    // public key, need to create a client access token and store it in cookie
    ;(async () => {
      const clientAccessTokenResponse = await Seam.getClientAccessToken({ pubKey, userIdentifierKey, endpoint })
      if (clientAccessTokenResponse.ok === false || !clientAccessTokenResponse['client_session']) {
        throw new Error('Could not get client access token')
      }
      const clientAccessToken = clientAccessTokenResponse?.client_session?.token
      if (!clientAccessToken) {
        throw new Error('Could not get client access token')
      }
      setCookie(`seam-clientAccessToken-${userIdentifierKey}`, clientAccessToken, 30)
      const seam = new Seam({
        apiKey: clientAccessToken,
        endpoint: endpoint,
      })
      return seam
      // TODO: improve: use devices are not loading probably due to async nature of this hook
    })()
  } else {
      throw new Error('No pubKey nor clientAccessToken provided or they are invalid')
      return null as any
  }
  return null as any
}

export default useSeamClient

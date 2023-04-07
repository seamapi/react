import Seam from 'seamapi'
import { getCookie, setCookie } from '../utils'

export const useSeamClient = ({
  apiKey,
  endpoint,
  userIdentifierKey,
}: {
  apiKey: string
  endpoint: string
  userIdentifierKey: string
}): Seam => {
  if (typeof window === 'undefined') return null as any
  if (!apiKey) {
    throw new Error('No API key provided')
    return null as any
  }
  const clientAccessTokenFromCookie = getCookie(`seam-clientAccessToken-${userIdentifierKey}`)
  if (clientAccessTokenFromCookie) {
    // already have client access token from cookie
    const seam = new Seam({
      apiKey: clientAccessTokenFromCookie,
      endpoint,
    })
    return seam
  } else if (apiKey.startsWith('seam_cat')) {
    // backend generated client access token
    setCookie(`seam-clientAccessToken-${userIdentifierKey}`, apiKey, 30)
    const seam = new Seam({
      apiKey,
      endpoint,
    })
    return seam
  } else if (apiKey.startsWith('seam_pk1')) {
    // public key, need to exchange for client access token
    ;(async () => {
      const clientAccessTokenResponse = await Seam.getClientAccessToken(apiKey, userIdentifierKey, endpoint)
      if (clientAccessTokenResponse.ok === false || !clientAccessTokenResponse['client_access_token']) {
        throw new Error('Could not get client access token')
      }
      const clientAccessToken = clientAccessTokenResponse?.client_access_token?.token
      if (!clientAccessToken) {
        throw new Error('Could not get client access token')
      }
      setCookie(`seam-clientAccessToken-${userIdentifierKey}`, clientAccessToken, 30)
      const seam = new Seam({
        apiKey: clientAccessToken,
        endpoint: endpoint,
      })
      return seam
    })()
  } else {
    throw new Error('Invalid API key')
  }
  return null as any
}

export default useSeamClient

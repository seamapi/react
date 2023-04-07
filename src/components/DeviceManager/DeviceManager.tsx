import React, { useContext, useEffect, useRef, useState } from 'react'
import Seam, { CommonDeviceProperties, Device } from 'seamapi'
import { getCookie, setCookie } from '../../utils'
import { SeamContext } from '../SeamProvider'

const DeviceManager = (props: any) => {
  const { pubKey, clientAccessToken, seamEndpoint } = useContext(SeamContext)
  console.log('pubKey', pubKey)
  console.log('clientAccessToken', clientAccessToken)

  const triggered = useRef<boolean>(false)

  const { email } = props // TODO: change email to userIdentifierKey in DB
  const clientAccessTokenFromProp = props.clientAccessToken
  const [devices, setDevices] = useState<Device<CommonDeviceProperties>[]>([])
  useEffect(() => {
    const hasBeenTriggered = triggered.current
    if (hasBeenTriggered) {
      return
    } else {
      triggered.current = true
    }

    ;(async () => {
      if (clientAccessTokenFromProp) {
        const seam = new Seam({
          apiKey: clientAccessTokenFromProp,
          endpoint: seamEndpoint,
        })

        const devices = await seam.devices.list()
        const connectWebviews = await seam.connectWebviews.list()

        setDevices(devices)
        console.log('connectWebviews', connectWebviews)

        return
      }
      const clientAccessTokenFromCookie = getCookie('seam-clientAccessToken')
      if (clientAccessTokenFromCookie) {
        const seam = new Seam({
          apiKey: clientAccessTokenFromCookie,
          endpoint: seamEndpoint,
        })

        const devices = await seam.devices.list()
        // const connectWebviews = await seam.connectWebviews.list()

        setDevices(devices)
        return
      }
      const clientAccessTokenResponse = await Seam.getClientAccessToken(
        window.SEAM_PUBLISHED_KEY,
        email,
        seamEndpoint
      )
      if (
        clientAccessTokenResponse.ok === false ||
        !clientAccessTokenResponse['client_access_token']
      ) {
        throw new Error('Could not get client access token')
      }
      const clientAccessToken =
        clientAccessTokenResponse?.client_access_token?.token
      if (!clientAccessToken) {
        throw new Error('Could not get client access token')
      }

      setCookie('seam-clientAccessToken', clientAccessToken, 1)
      const seam = new Seam({
        apiKey: clientAccessToken,
        endpoint: seamEndpoint,
      })
      const devices = await seam.devices.list()
      // const connectWebviews = await seam.connectWebviews.list()
      setDevices(devices)
    })()
  }, [])
  return (
    <>
      <h1>Device Manager</h1>
      <ul>
        {devices.map((device) => (
          <li key={device.device_id}>
            {device.device_id}: {device.properties.name}
            <button>view device</button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default DeviceManager

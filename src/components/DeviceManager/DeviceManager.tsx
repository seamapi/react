import React, { useEffect, useState } from 'react'
import Seam, { CommonDeviceProperties, Device } from 'seamapi'
const getCookie = (name: string) => {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}
const setCookie = (name: string, value: string, days: number) => {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}
const deleteCookie = (name: string) => {
  document.cookie = name + '=; Max-Age=-99999999;'
}

export interface DeviceManagerProps {
  label: string
}
let isInit = false
const DeviceManager = (props: DeviceManagerProps) => {
  const [devices, setDevices] = useState<Device<CommonDeviceProperties>[]>([])
  useEffect(() => {
    if (isInit) return
    isInit = true
    ;(async () => {
      debugger
      const clientAccessTokenFromCookie = getCookie('seam-clientAccessToken')
      if (clientAccessTokenFromCookie) {
        const seam = new Seam({
          apiKey: clientAccessTokenFromCookie,
          endpoint: window.SEAM_ENDPOINT,
        })
        const devices = await seam.devices.list()
        return
      }
      const clientAccessTokenResponse = await Seam.getClientAccessToken(
        window.SEAM_PUBLISHED_KEY,
        'azat@getseam.com',
        window.SEAM_ENDPOINT,
        '0cb1c256-4589-4d15-aae0-c434d94fb138'
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
        endpoint: window.SEAM_ENDPOINT,
      })
      const devices = await seam.devices.list()
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
          </li>
        ))}
      </ul>
      <button>{props.label}</button>
    </>
  )
}

export default DeviceManager

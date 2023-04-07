import React, { useContext, useEffect, useRef, useState } from 'react'
import Seam, { CommonDeviceProperties, Device } from 'seamapi'
import useDevices from '../../hooks/use-devices'
import useSeamClient from '../../hooks/use-seam-client'
import { getCookie, setCookie } from '../../utils'
import { SeamContext } from '../SeamProvider'

const DeviceManager = (props: any) => {
  const { pubKey, clientAccessToken, seamEndpoint, userIdentifierKey } = useContext(SeamContext)
  console.log('pubKey', pubKey)
  console.log('clientAccessToken', clientAccessToken)
  console.log('userIdentifierKey', userIdentifierKey)

  // const triggered = useRef<boolean>(false)

  const { email } = props // TODO: change email to userIdentifierKey in DB
  const seam = useSeamClient({
    apiKey: pubKey || clientAccessToken || '',
    endpoint: seamEndpoint,
    userIdentifierKey,
  })
  const { isLoading, data: devices } = useDevices(seam)

  return (
    <>
      <h1>Device Manager</h1>
      <ul>
        {isLoading ? <li>Loading...</li> : ''}
        {!isLoading &&
          devices &&
          devices.map((device) => (
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

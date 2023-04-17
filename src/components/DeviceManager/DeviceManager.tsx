import React, { useContext, useEffect, useRef, useState } from 'react'
import Seam, { CommonDeviceProperties, Device } from 'seamapi'
import useDevices from '../../hooks/use-devices'
import useSeamClient from '../../hooks/use-seam-client'
import { getCookie, setCookie } from '../../utils'
import { SeamContext } from '../SeamProvider'
import './DeviceManager.css' // TODO: add postcss

const DeviceManager = (props: any) => {
  const { publishableKey, clientSessionToken, seamEndpoint, userIdentifierKey } = useContext(SeamContext)
  const { email } = props // TODO: change email to userIdentifierKey in DB
  const seam = useSeamClient({
    publishableKey,
    clientSessionToken,
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

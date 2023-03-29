import React, { useEffect, useState } from 'react'
import Seam, { CommonDeviceProperties, Device } from 'seamapi'

export interface DeviceManagerProps {
  label: string
}

const DeviceManager = (props: DeviceManagerProps) => {
  const [devices, setDevices] = useState<Device<CommonDeviceProperties>[]>([])
  useEffect(() => {
    ;(async () => {
      const seam = new Seam({
        apiKey: window.SEAM_PUBLISHED_KEY,
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

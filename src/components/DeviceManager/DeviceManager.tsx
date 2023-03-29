import React, { useEffect, useState } from 'react'
// import Seam from 'seamapi'

export interface DeviceManagerProps {
  label: string
}

const DeviceManager = (props: DeviceManagerProps) => {
  const [devices, setDevices] = useState(['1','2'])
  return (
    <>
      <h1>Device Manager</h1>
      <ul>
        {devices.map((device) => (
          <li key={device}>{device}</li>
        ))}
      </ul>
      <button>{props.label}</button>
    </>
  )
}

export default DeviceManager

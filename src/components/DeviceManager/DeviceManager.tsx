import React, { useEffect } from 'react'
import Seam from 'seamapi'

export interface DeviceManagerProps {
  label: string
}

const DeviceManager = (props: DeviceManagerProps) => {
  const [devices, setDevices] = React.useState([])
  useEffect(() => {}, [])
  return (
    <>
      <h1>Device Manager</h1>
      <button>{props.label}</button>
    </>
  )
}

export default DeviceManager

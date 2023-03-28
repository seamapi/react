import React from "react";

export interface DeviceManagerProps {
  label: string;
}

const DeviceManager = (props: DeviceManagerProps) => {
  return <>
    <h1>Device Manager</h1>
    <button>{props.label}</button>
  </>;
};

export default DeviceManager;

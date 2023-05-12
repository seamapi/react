import React, { useState } from 'react'

import { AccessCodeTable, DeviceDetails, DeviceTable } from 'lib/index.js'

import AccessCodeDetails from 'lib/ui/AccessCodeDetails/AccessCodeDetails.js'

interface DeviceTableView {
  name: 'device_table'
}

interface DeviceDetailView {
  name: 'device_detail'
  deviceId: string
}

interface AccessCodeTableView {
  name: 'access_code_table'
  deviceId: string
}

interface AccessCodeDetailView {
  name: 'access_code_detail'
  accessCodeId: string
}

type View =
  | DeviceTableView
  | DeviceDetailView
  | AccessCodeTableView
  | AccessCodeDetailView

export interface NavigationStackProps {
  children: JSX.Element
}

interface NavigationContextProps {
  show: (view: View) => void
  goBack?: () => void
}

const NavigationContext = React.createContext<
  NavigationContextProps | undefined
>(undefined)

export default function NavigationProvider({ children }: NavigationStackProps) {
  const [views, setViews] = useState<View[]>([])

  const pushView = (view: View) => {
    setViews((current) => [view, ...current])
  }

  const popView = () => {
    setViews((current) => {
      if (current.length === 0) {
        return current
      }

      const [_showing, ...others] = current
      return others
    })
  }

  const hasViews = views.length > 0

  return (
    <NavigationContext.Provider
      value={{
        show: pushView,
        goBack: hasViews ? popView : undefined,
      }}
    >
      <Content views={views} rootView={children} />
    </NavigationContext.Provider>
  )
}

function Content({
  views,
  rootView,
}: {
  views: View[]
  rootView: JSX.Element
}) {
  const firstView = views[0]
  if (firstView != null) {
    return <Subview view={firstView} />
  }

  return rootView
}

export function useNavigation(): NavigationContextProps {
  const context = React.useContext(NavigationContext)
  if (context === undefined) {
    return {
      show: () => {},
      goBack: undefined,
    }
  }

  return context
}

function Subview({ view }: { view: View }) {
  switch (view.name) {
    case 'device_detail':
      return <DeviceDetails deviceId={view.deviceId} />
    case 'access_code_detail':
      return <AccessCodeDetails accessCodeId={view.accessCodeId} />
    case 'device_table':
      return <DeviceTable />
    case 'access_code_table':
      return <AccessCodeTable deviceId={view.deviceId} />
  }
}

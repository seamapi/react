import React, { useState } from 'react'

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

export type View =
  | DeviceTableView
  | DeviceDetailView
  | AccessCodeTableView
  | AccessCodeDetailView

export interface NavigationStackProps {
  children: JSX.Element
}

interface NavigationContextProps {
  views: View[]
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
        views,
        show: pushView,
        goBack: hasViews ? popView : undefined,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation(): NavigationContextProps {
  const context = React.useContext(NavigationContext)
  if (context === undefined) {
    return {
      show: () => {},
      goBack: undefined,
      views: [],
    }
  }

  return context
}

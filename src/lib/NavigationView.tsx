import { AccessCodeTable, DeviceDetails, DeviceTable } from 'lib/index.js'

import { useNavigation, type View } from 'lib/NavigationProvider.js'
import AccessCodeDetails from 'lib/ui/AccessCodeDetails/AccessCodeDetails.js'

interface NavigationViewProps {
  children: JSX.Element
}

export function NavigationView({ children: rootView }: NavigationViewProps) {
  const { views } = useNavigation()

  const firstView = views[0]
  if (firstView != null) {
    return <Subview view={firstView} />
  }

  return rootView
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

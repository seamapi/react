import { DeviceTable } from 'lib/index.js'
import type { UseDeviceData } from '../../../hooks.js'
import { ContentHeader } from '../layout/ContentHeader.js'

interface ClimateSettingScheduleDeviceSelectProps {
  devices: NonNullable<UseDeviceData>[]
  onBack?: () => void
  onSelect: (deviceId: string) => void
}

export const ClimateSettingScheduleDeviceSelect = ({
  devices,
  onBack,
  onSelect,
}: ClimateSettingScheduleDeviceSelectProps) => {
  return (
    <>
      <ContentHeader title={t.tableHeader} onBack={onBack} />
      <DeviceTable />
    </>
  )
}

const t = {
  tableHeader: 'Choose a device',
  done: 'Done',
}

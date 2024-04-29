import type { CommonDevice } from 'seamapi'

import { BeeIcon } from 'lib/icons/Bee.js'
import type { CommonProps } from 'lib/seam/components/common-props.js'
import { useConnectedAccount } from 'lib/seam/connected-accounts/use-connected-account.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'

interface DeviceInfoProps
  extends Required<
    Pick<
      CommonProps,
      'disableConnectedAccountInformation' | 'disableResourceIds'
    >
  > {
  device: CommonDevice
}

export function DeviceInfo({
  device,
  disableConnectedAccountInformation,
  disableResourceIds,
}: DeviceInfoProps): JSX.Element | null {
  const { connectedAccount } = useConnectedAccount(device.connected_account_id)
  return (
    <DetailSection label={t.deviceInfo}>
      <DetailRow label={t.manufacturer}>
        <div className='seam-detail-row-hstack'>
          {device.properties.model.manufacturer_display_name}
          {device.properties.manufacturer === 'ecobee' && <BeeIcon />}
        </div>
      </DetailRow>
      {!disableConnectedAccountInformation && (
        <DetailRow
          label={t.linkedAccount}
          sublabel={
            connectedAccount?.user_identifier?.email ??
            device.connected_account_id
          }
        />
      )}
      {!disableResourceIds && (
        <DetailRow label={t.deviceId} sublabel={device.device_id} />
      )}
    </DetailSection>
  )
}

const t = {
  deviceInfo: 'Device info',
  manufacturer: 'Manufacturer',
  linkedAccount: 'Linked account',
  deviceId: 'Device ID',
}

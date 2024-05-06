import classNames from 'classnames'
import type { NoiseSensorDevice } from 'seamapi'

import type { NestedSpecificDeviceDetailsProps } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { DeviceInfo } from 'lib/seam/components/DeviceDetails/DeviceInfo.js'
import { DeviceModel } from 'lib/seam/components/DeviceDetails/DeviceModel.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { NoiseThresholdsList } from 'lib/ui/noise-sensor/NoiseThresholdsList.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

interface NoiseSensorDeviceDetailsProps
  extends NestedSpecificDeviceDetailsProps {
  device: NoiseSensorDevice
}

export function NoiseSensorDeviceDetails({
  device,
  disableConnectedAccountInformation,
  disableResourceIds,
  onBack,
  className,
}: NoiseSensorDeviceDetailsProps): JSX.Element | null {
  return (
    <div className={classNames('seam-device-details', className)}>
      <ContentHeader title={t.noiseSensor} onBack={onBack} />

      <div className='seam-body'>
        <div className='seam-summary'>
          <div className='seam-content'>
            <div className='seam-image'>
              <DeviceImage device={device} />
            </div>
            <div className='seam-info'>
              <span className='seam-label'>{t.noiseSensor}</span>
              <h4 className='seam-device-name'>{device.properties.name}</h4>
              <div className='seam-properties'>
                <span className='seam-label'>{t.status}:</span>{' '}
                <OnlineStatus device={device} />
                <DeviceModel device={device} />
              </div>
            </div>
          </div>
        </div>

        <NoiseThresholdsList device={device} />

        <DeviceInfo
          device={device}
          disableConnectedAccountInformation={
            disableConnectedAccountInformation
          }
          disableResourceIds={disableResourceIds}
        />
      </div>
    </div>
  )
}

const t = {
  noiseSensor: 'Noise Sensor',
  status: 'Status',
  noiseLevel: 'Noise level',
}

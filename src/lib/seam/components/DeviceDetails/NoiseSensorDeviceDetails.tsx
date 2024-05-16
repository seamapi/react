import classNames from 'classnames'
import { useState } from 'react'
import type { NoiseSensorDevice } from 'seamapi'

import type { NestedSpecificDeviceDetailsProps } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { DeviceInfo } from 'lib/seam/components/DeviceDetails/DeviceInfo.js'
import { DeviceModel } from 'lib/seam/components/DeviceDetails/DeviceModel.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { NoiseSensorActivityList } from 'lib/ui/noise-sensor/NoiseSensorActivityList.js'
import { NoiseThresholdsList } from 'lib/ui/noise-sensor/NoiseThresholdsList.js'
import { TabSet } from 'lib/ui/TabSet.js'

type TabType = 'Details' | 'Activity'

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
  const [tab, setTab] = useState<TabType>('Details')

  return (
    <div className={classNames('seam-device-details', className)}>
      <div className='seam-body seam-body-no-margin'>
        <div className='seam-contained-summary'>
          <ContentHeader
            title={t.noiseSensor}
            onBack={onBack}
            className='seam-content-header-contained'
          />
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

          <TabSet<TabType>
            tabs={['Details', 'Activity']}
            activeTab={tab}
            onTabChange={(tab) => {
              setTab(tab)
            }}
          />
        </div>

        {tab === 'Details' && (
          <>
            <NoiseThresholdsList device={device} />

            <DeviceInfo
              device={device}
              disableConnectedAccountInformation={
                disableConnectedAccountInformation
              }
              disableResourceIds={disableResourceIds}
            />
          </>
        )}

        {tab === 'Activity' && <NoiseSensorActivityList device={device} />}
      </div>
    </div>
  )
}

const t = {
  noiseSensor: 'Noise Sensor',
  status: 'Status',
  noiseLevel: 'Noise level',
}

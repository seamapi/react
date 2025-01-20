import classNames from 'classnames'
import { useState } from 'react'

import type { NestedSpecificDeviceDetailsProps } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { DeviceInfo } from 'lib/seam/components/DeviceDetails/DeviceInfo.js'
import { DeviceModel } from 'lib/seam/components/DeviceDetails/DeviceModel.js'
import { SeamEditableDeviceName } from 'lib/seam/components/SeamEditableDeviceName/SeamEditableDeviceName.js'
import type { NoiseSensorDevice } from 'lib/seam/noise-sensors/noise-sensor-device.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { NoiseLevelStatus } from 'lib/ui/device/NoiseLevelStatus.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { NoiseSensorActivityList } from 'lib/ui/noise-sensor/NoiseSensorActivityList.js'
import { NoiseThresholdsList } from 'lib/ui/noise-sensor/NoiseThresholdsList.js'
import { TabSet } from 'lib/ui/TabSet.js'

type TabType = 'details' | 'activity'

interface NoiseSensorDeviceDetailsProps
  extends NestedSpecificDeviceDetailsProps {
  device: NoiseSensorDevice
  onEditName?: (newName: string) => void
}

export function NoiseSensorDeviceDetails({
  device,
  disableConnectedAccountInformation,
  disableResourceIds,
  onBack,
  className,
  onEditName,
}: NoiseSensorDeviceDetailsProps): JSX.Element | null {
  const [tab, setTab] = useState<TabType>('details')

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
                <SeamEditableDeviceName
                  onEdit={onEditName}
                  tagName='h4'
                  value={device.properties.name}
                />
                <div className='seam-properties'>
                  <span className='seam-label'>{t.status}:</span>{' '}
                  <OnlineStatus device={device} />
                  <NoiseLevelStatus device={device} />
                  <DeviceModel device={device} />
                </div>
              </div>
            </div>
          </div>

          <TabSet<TabType>
            tabs={['details', 'activity']}
            tabTitles={{
              details: t.details,
              activity: t.activity,
            }}
            activeTab={tab}
            onTabChange={(tab) => {
              setTab(tab)
            }}
          />
        </div>

        {tab === 'details' && (
          <div className='seam-padded-container'>
            <NoiseThresholdsList device={device} />

            <DeviceInfo
              device={device}
              disableConnectedAccountInformation={
                disableConnectedAccountInformation
              }
              disableResourceIds={disableResourceIds}
            />
          </div>
        )}

        {tab === 'activity' && <NoiseSensorActivityList device={device} />}
      </div>
    </div>
  )
}

const t = {
  noiseSensor: 'Noise Sensor',
  status: 'Status',
  noiseLevel: 'Noise level',
  details: 'Details',
  activity: 'Activity',
}

import type { NoiseSensorDevice, NoiseThresholds } from 'seamapi'

import { formatTime, formatTimeZone } from 'lib/dates.js'
import { ArrowRightIcon } from 'lib/icons/ArrowRight.js'
import type { NestedSpecificDeviceDetailsProps } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { DeviceInfo } from 'lib/seam/components/DeviceDetails/DeviceInfo.js'
import { DeviceModel } from 'lib/seam/components/DeviceDetails/DeviceModel.js'
import { useNoiseThresholds } from 'lib/seam/noise-sensors/use-noise-thresholds.js'
import { BatteryStatus } from 'lib/ui/device/BatteryStatus.js'
import { DeviceImage } from 'lib/ui/device/DeviceImage.js'
import { OnlineStatus } from 'lib/ui/device/OnlineStatus.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'

interface NoiseSensorDeviceDetailsProps
  extends NestedSpecificDeviceDetailsProps {
  device: NoiseSensorDevice
}

export function NoiseSensorDeviceDetails({
  device,
  disableConnectedAccountInformation,
  disableResourceIds,
}: NoiseSensorDeviceDetailsProps): JSX.Element | null {
  const { noise_thresholds, isInitialLoading } = useNoiseThresholds({
    device_id: device.device_id,
  })

  return (
    <div className='seam-device-details'>
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
                <span className='seam-label'>{t.noiseLevel}:</span>{' '}
                <BatteryStatus device={device} />
                <DeviceModel device={device} />
              </div>
            </div>
          </div>
        </div>

        <DetailSectionGroup>
          <div className='seam-detail-section-wrap'>
            <DetailSection label='Noise thresholds' tooltipContent=''>
              {!isInitialLoading && (noise_thresholds?.length ?? 0) > 0 ? (
                noise_thresholds?.map((noiseThreshold) => (
                  <DetailRow
                    label={
                      <div className='seam-detail-row-label-column'>
                        {noiseThreshold.name && (
                          <span className='seam-detail-row-label'>
                            {noiseThreshold.name}
                          </span>
                        )}
                        <div className='seam-detail-row-label-block'>
                          <span className='seam-row-sublabel seam-row-sublabel-text-default'>
                            {formatTime(noiseThreshold.starts_daily_at)}
                          </span>
                          <ArrowRightIcon />
                          <span className='seam-row-sublabel seam-row-sublabel-text-default'>
                            {formatTime(noiseThreshold.ends_daily_at)}
                          </span>
                        </div>
                      </div>
                    }
                  >
                    <p>{noiseThreshold.noise_threshold_decibels} dB</p>
                  </DetailRow>
                ))
              ) : (
                <DetailRow
                  label={
                    <span className='seam-detail-row-empty-label'>None</span>
                  }
                />
              )}
            </DetailSection>

            <div className='seam-detail-section-footer'>
              <div className='seam-empty-div' />
              <div className='seam-detail-section-footer-content'>
                <div className='seam-detail-section-footer-content-text'>
                  <p>{generateTimeZoneCaption(device, noise_thresholds)}</p>
                </div>
              </div>
            </div>
          </div>
        </DetailSectionGroup>

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

const generateTimeZoneCaption = (
  device: NoiseSensorDevice,
  thresholds: NoiseThresholds[] | undefined
): string | null => {
  if (device.location?.timezone) {
    return `All times in ${formatTimeZone(device.location.timezone)}`
  }

  if (!thresholds) {
    return null
  }

  const timeZone =
    thresholds[0]?.starts_daily_at.match(/\[(.*?)\]/)?.[1] ?? 'UTC'
  return `All times in ${formatTimeZone(timeZone)}`
}

const t = {
  noiseSensor: 'Noise Sensor',
  status: 'Status',
  noiseLevel: 'Noise level',
}

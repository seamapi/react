import type { NoiseSensorDevice, NoiseThresholds } from 'seamapi'

import { formatTime, formatTimeZone } from 'lib/dates.js'
import { ArrowRightIcon } from 'lib/icons/ArrowRight.js'
import { useNoiseThresholds } from 'lib/seam/noise-sensors/use-noise-thresholds.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'

interface NoiseThresholdsListProps {
  device: NoiseSensorDevice
}

export function NoiseThresholdsList({
  device,
}: NoiseThresholdsListProps): JSX.Element {
  const { noiseThresholds, isInitialLoading } = useNoiseThresholds({
    device_id: device.device_id,
  })

  return (
    <>
      <DetailSectionGroup>
        <div className='seam-detail-section-wrap'>
          <DetailSection
            label={t.noiseThresholds}
            tooltipContent={
              device.device_type === 'minut_sensor' ? (
                <div className='seam-detail-section-tooltip-inner-content'>
                  <span className='seam-tooltip-content'>
                    {t.minutTooltipFirst}
                  </span>
                  <span className='seam-tooltip-content'>
                    {t.minutTooltipSecond}
                  </span>
                </div>
              ) : (
                t.tooltip
              )
            }
          >
            {!isInitialLoading && (noiseThresholds?.length ?? 0) > 0 ? (
              noiseThresholds?.map((noiseThreshold) => (
                <DetailRow
                  key={noiseThreshold.noise_threshold_id}
                  label={
                    <div className='seam-detail-row-label-column'>
                      {noiseThreshold.name !== '' && (
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
                  <p>
                    {noiseThreshold.noise_threshold_decibels} {t.decibel}
                  </p>
                </DetailRow>
              ))
            ) : (
              <DetailRow
                label={
                  <span className='seam-detail-row-empty-label'>{t.none}</span>
                }
              />
            )}
          </DetailSection>

          <div className='seam-detail-section-footer'>
            <div className='seam-empty-div' />
            <div className='seam-detail-section-footer-content'>
              <div className='seam-detail-section-footer-content-text'>
                <p>{getTimeZoneCaption(device, noiseThresholds)}</p>
              </div>
            </div>
          </div>
        </div>
      </DetailSectionGroup>
    </>
  )
}

const getTimeZoneCaption = (
  device: NoiseSensorDevice,
  thresholds: NoiseThresholds[] | undefined
): string | null => {
  if (device.location?.timezone != null) {
    return `All times in ${formatTimeZone(device.location.timezone)}`
  }

  if (thresholds == null) {
    return null
  }

  const timeZone =
    thresholds[0]?.starts_daily_at.match(/\[(.*?)\]/)?.[1] ?? 'UTC'
  return `All times in ${formatTimeZone(timeZone)}`
}

const t = {
  noiseThresholds: 'Noise thresholds',
  tooltip:
    'A noise threshold is the highest noise level (in dB) you want to allow for a given time range in the day.',
  minutTooltipFirst:
    'A noise threshold is the highest noise level (in dB) you want to allow.',
  minutTooltipSecond:
    'Quiet hours is a separate threshold that takes effect only for a specified time range.',
  none: 'None',
  decibel: 'dB',
}

import classNames from 'classnames'
import { useState } from 'react'

import { ArrowRightIcon } from 'lib/icons/ArrowRight.js'
import { ChevronRightIcon } from 'lib/icons/ChevronRight.js'
import { DeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { useClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'
import { Tooltip } from 'lib/ui/Tooltip/Tooltip.js'

import { formatDateAndTime } from 'lib/dates.js'
import Switch from 'lib/ui/Switch.js'
import { ClimateSettingScheduleCard } from 'lib/ui/thermostat/ClimateSettingScheduleCard.js'

export interface ClimateSettingScheduleDetailsProps {
  climateSettingScheduleId: string
  onBack?: () => void
  className?: string
}

export function ClimateSettingScheduleDetails({
  climateSettingScheduleId,
  onBack,
  className,
}: ClimateSettingScheduleDetailsProps): JSX.Element | null {
  const { climateSettingSchedule } = useClimateSettingSchedule(
    climateSettingScheduleId
  )
  const [selectedDeviceId, selectDevice] = useState<string | null>(null)

  if (climateSettingSchedule == null) {
    return null
  }

  if (selectedDeviceId != null) {
    return (
      <DeviceDetails
        className={className}
        deviceId={selectedDeviceId}
        onBack={() => {
          selectDevice(null)
        }}
      />
    )
  }

  return (
    <div
      className={classNames('seam-climate-setting-schedule-details', className)}
    >
      <ContentHeader title='Climate setting schedule' onBack={onBack} />
      <ClimateSettingScheduleCard
        climateSettingScheduleId={climateSettingScheduleId}
      />
      <span className='seam-default-setting-message'>
        {t.defaultSettingMessagePart1}
        &nbsp;<span className='seam-default-setting'>{t.defaultSetting}</span>
        &nbsp;
        {t.defaultSettingMessagePart2}
      </span>
      <div className='seam-box'>
        <div className='seam-content seam-start-end-toggle'>
          <div>
            <span className='seam-label'>
              {t.startEndTime}
              <Tooltip>{t.startEndTimeTooltip}</Tooltip>
            </span>

            <div>
              <span className='seam-value'>
                {`${formatDateAndTime(
                  climateSettingSchedule.schedule_starts_at
                )}`}

                <ArrowRightIcon />
                {`${formatDateAndTime(
                  climateSettingSchedule.schedule_ends_at
                )}`}
              </span>
            </div>
          </div>
          <ChevronRightIcon className='chevron' />
        </div>
        <div className='seam-content seam-climate-setting-toggle'>
          <span className='seam-label'>
            {t.climateSetting} <Tooltip>{t.climateSettingTooltip}</Tooltip>
          </span>
          <div className='seam-right'>
            <ClimateSettingStatus
              climateSetting={climateSettingSchedule}
              iconPlacement='right'
            />
            <ChevronRightIcon className='chevron' />
          </div>
        </div>
        <div className='seam-content seam-allow-manual-override-toggle'>
          <span className='seam-label'>
            {t.allowManualOverride}{' '}
            <Tooltip>{t.allowManualOverrideTooltip}</Tooltip>
          </span>
          <div className='seam-right'>
            <Switch label />
          </div>
        </div>
      </div>
      <div style={{ height: '16px' }} />
      <div className='seam-box'>
        <div className='seam-content seam-creation-date'>
          <span className='seam-label'>{t.creationDate}</span>
          <span className='seam-right seam-value'>
            {formatDateAndTime(climateSettingSchedule.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}

const t = {
  climateSettingSchedule: 'Climate Setting Schedule',
  fallbackName: 'Climate Setting Schedule',
  id: 'ID',
  startEndTime: 'Start/End Time',
  startEndTimeTooltip:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consectetur, nisl ut sodales ultricies, elit elit vehicula nunc, eget blandit nunc tortor eu nibh.',

  climateSetting: 'Climate setting',
  climateSettingTooltip:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consectetur, nisl ut sodales ultricies, elit elit vehicula nunc, eget blandit nunc tortor eu nibh.',

  allowManualOverride: 'Allow manual override',
  allowManualOverrideTooltip:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam consectetur, nisl ut sodales ultricies, elit elit vehicula nunc, eget blandit nunc tortor eu nibh.',

  creationDate: 'Creation date',
  starts: 'Starts',
  defaultSettingMessagePart1: 'Thermostat will return to its',
  defaultSetting: 'default setting',
  defaultSettingMessagePart2: 'at end time.',
}

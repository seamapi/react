import classNames from 'classnames'
import { useState } from 'react'

import { DeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { useClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'

import { formatDateAndTime } from 'lib/dates.js'
import Switch from 'lib/ui/Switch/Switch.js'
import { AccordionRow } from 'lib/ui/layout/AccordionRow.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'
import { ClimateSettingScheduleCard } from './ClimateSettingScheduleCard.js'

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

  const [allowManualOverride, setAllowManualOverride] = useState(false)

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
      <div className='seam-climate-setting-schedule-details-content'>
        <ClimateSettingScheduleCard
          climateSettingScheduleId={climateSettingScheduleId}
        />
        <span className='seam-default-setting-message'>
          {t.defaultSettingMessagePart1}
          &nbsp;<span className='seam-default-setting'>{t.defaultSetting}</span>
          &nbsp;
          {t.defaultSettingMessagePart2}
        </span>
        <DetailSectionGroup>
          <DetailSection>
            <AccordionRow label={t.startEndTime} />
            <AccordionRow label={t.climateSetting} />
            <DetailRow label={t.allowManualOverride}>
              <Switch
                checked={allowManualOverride}
                onChange={setAllowManualOverride}
                enableLabel
              />
            </DetailRow>
          </DetailSection>
          <DetailSection>
            <DetailRow label={t.creationDate}>
              {formatDateAndTime(climateSettingSchedule.created_at)}
            </DetailRow>
          </DetailSection>
        </DetailSectionGroup>
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

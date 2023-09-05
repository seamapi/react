import classNames from 'classnames'
import { useState } from 'react'

import { DeviceDetails } from '../index.js'

import { formatDateAndTime } from 'lib/dates.js'
import { ArrowRightIcon } from 'lib/icons/ArrowRight.js'
import { useClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'

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

  if (climateSettingSchedule == null) {
    return null
  }

  const isManualOverrideAllowed =
    climateSettingSchedule.manual_override_allowed ?? false

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
      <ContentHeader title={t.climateSettingSchedule} onBack={onBack} />
      <div className='seam-climate-setting-schedule-details-content'>
        <ClimateSettingScheduleCard
          climateSettingScheduleId={climateSettingScheduleId}
          onSelectDevice={selectDevice}
        />
        <div className='seam-default-setting-message-container'>
          <span className='seam-default-setting-message'>
            {t.defaultSettingMessagePart1}{' '}
            <span className='seam-default-setting-text'>
              {t.defaultSetting}
            </span>{' '}
            {t.defaultSettingMessagePart2}
          </span>
        </div>
        <DetailSectionGroup>
          <DetailSection>
            <DetailRow label={t.startEndTime}>
              <span className='seam-climate-setting-details-value seam-climate-setting-details-schedule-range'>
                {`${formatDateAndTime(
                  climateSettingSchedule.schedule_starts_at
                )}`}
                <ArrowRightIcon />
                {`${formatDateAndTime(
                  climateSettingSchedule.schedule_ends_at
                )}`}
              </span>
            </DetailRow>
            <DetailRow label={t.climateSetting}>
              <ClimateSettingStatus
                climateSetting={climateSettingSchedule}
                iconPlacement='right'
              />
            </DetailRow>
            <DetailRow label={t.allowManualOverride}>
              <span className='seam-climate-setting-details-value'>
                {isManualOverrideAllowed ? t.on : t.off}
              </span>
            </DetailRow>
          </DetailSection>
          <DetailSection>
            <DetailRow label={t.creationDate}>
              <div className='seam-creation-date'>
                {formatDateAndTime(climateSettingSchedule.created_at)}
              </div>
            </DetailRow>
          </DetailSection>
        </DetailSectionGroup>
      </div>
    </div>
  )
}

const t = {
  climateSettingSchedule: 'Climate setting schedule',
  startEndTime: 'Start/End Time',
  climateSetting: 'Climate setting',
  allowManualOverride: 'Allow manual override',
  creationDate: 'Creation date',
  defaultSettingMessagePart1: 'Thermostat will return to its',
  defaultSetting: 'default setting',
  defaultSettingMessagePart2: 'at end time.',
  on: 'On',
  off: 'Off',
}

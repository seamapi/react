import classNames from 'classnames'
import { useState } from 'react'

import { formatDateAndTime } from 'lib/dates.js'
import { useClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { AccordionRow } from 'lib/ui/layout/AccordionRow.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'
import Switch from 'lib/ui/Switch/Switch.js'
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

  const [allowManualOverride, setAllowManualOverride] = useState(false)

  if (climateSettingSchedule == null) {
    return null
  }

  return (
    <div
      className={classNames('seam-climate-setting-schedule-details', className)}
    >
      <ContentHeader title={t.climateSettingSchedule} onBack={onBack} />
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
            <AccordionRow
              label={t.climateSetting}
              rightCollapsedContent={
                <ClimateSettingStatus
                  climateSetting={climateSettingSchedule}
                  iconPlacement='right'
                />
              }
            />
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
  starts: 'Starts',
  defaultSettingMessagePart1: 'Thermostat will return to its',
  defaultSetting: 'default setting',
  defaultSettingMessagePart2: 'at end time.',
}

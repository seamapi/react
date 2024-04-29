import classNames from 'classnames'
import { useState } from 'react'

import { ArrowRightIcon } from 'lib/icons/ArrowRight.js'
import { ClimateSettingScheduleCard } from 'lib/seam/components/ClimateSettingScheduleDetails/ClimateSettingScheduleCard.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { NestedDeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { useClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedule.js'
import { useUpdateClimateSettingSchedule } from 'lib/seam/thermostats/climate-setting-schedules/use-update-climate-setting-schedule.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { DetailRow } from 'lib/ui/layout/DetailRow.js'
import { DetailSection } from 'lib/ui/layout/DetailSection.js'
import { DetailSectionGroup } from 'lib/ui/layout/DetailSectionGroup.js'
import { Snackbar } from 'lib/ui/Snackbar/Snackbar.js'
import { Switch } from 'lib/ui/Switch/Switch.js'
import { ClimateSettingStatus } from 'lib/ui/thermostat/ClimateSettingStatus.js'

import { formatDateTime } from './dates.js'

export interface ClimateSettingScheduleDetailsProps extends CommonProps {
  climateSettingScheduleId: string
}

export const NestedClimateSettingScheduleDetails = withRequiredCommonProps(
  ClimateSettingScheduleDetails
)

export function ClimateSettingScheduleDetails({
  climateSettingScheduleId,
  disableLockUnlock = false,
  disableDeleteAccessCode = false,
  onBack,
  className,
  errorFilter = () => true,
  warningFilter = () => true,
  disableCreateAccessCode,
  disableEditAccessCode,
  disableResourceIds = false,
  disableConnectedAccountInformation = false,
  disableDeviceManufacturerInformation = false,
  disableClimateSettingSchedules,
}: ClimateSettingScheduleDetailsProps): JSX.Element | null {
  useComponentTelemetry('ClimateSettingScheduleDetails')

  const { climateSettingSchedule } = useClimateSettingSchedule(
    climateSettingScheduleId
  )

  const { mutate, isSuccess, isError } = useUpdateClimateSettingSchedule()

  const [selectedDeviceId, selectDevice] = useState<string | null>(null)

  if (climateSettingSchedule == null) {
    return null
  }

  const isManualOverrideAllowed =
    climateSettingSchedule.manual_override_allowed ?? false

  if (selectedDeviceId != null) {
    return (
      <NestedDeviceDetails
        deviceId={selectedDeviceId}
        errorFilter={errorFilter}
        warningFilter={warningFilter}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        disableResourceIds={disableResourceIds}
        disableConnectedAccountInformation={disableConnectedAccountInformation}
        disableDeviceManufacturerInformation={
          disableDeviceManufacturerInformation
        }
        disableClimateSettingSchedules={disableClimateSettingSchedules}
        onBack={() => {
          selectDevice(null)
        }}
        className={className}
      />
    )
  }

  return (
    <>
      <div
        className={classNames(
          'seam-climate-setting-schedule-details',
          className
        )}
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
                  {formatDateTime(climateSettingSchedule.schedule_starts_at)}
                  <ArrowRightIcon />
                  {formatDateTime(climateSettingSchedule.schedule_ends_at)}
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
                  <Switch
                    checked={isManualOverrideAllowed}
                    onChange={(checked) => {
                      mutate({
                        climate_setting_schedule_id:
                          climateSettingSchedule.climate_setting_schedule_id,
                        manual_override_allowed: checked,
                      })
                    }}
                  />
                </span>
              </DetailRow>
            </DetailSection>
            <DetailSection>
              <DetailRow label={t.creationDate}>
                <div className='seam-creation-date'>
                  {formatDateTime(climateSettingSchedule.created_at)}
                </div>
              </DetailRow>
            </DetailSection>
          </DetailSectionGroup>
        </div>
      </div>
      <Snackbar
        message={t.manualOverrideSuccess}
        variant='success'
        visible={isSuccess}
        automaticVisibility
      />

      <Snackbar
        message={t.manualOverrideError}
        variant='error'
        visible={isError}
        automaticVisibility
      />
    </>
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
  manualOverrideSuccess: 'Successfully updated manual override!',
  manualOverrideError: 'Error updating manual override. Please try again.',
}

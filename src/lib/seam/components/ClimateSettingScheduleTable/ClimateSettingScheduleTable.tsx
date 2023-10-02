import classNames from 'classnames'
import { useCallback, useMemo, useState } from 'react'
import type { ClimateSettingSchedule } from 'seamapi'

import { useComponentTelemetry } from 'lib/telemetry/index.js'

import { compareByCreatedAtDesc } from 'lib/dates.js'
import { NestedClimateSettingScheduleDetails } from 'lib/seam/components/ClimateSettingScheduleDetails/ClimateSettingScheduleDetails.js'
import { ClimateSettingScheduleRow } from 'lib/seam/components/ClimateSettingScheduleTable/ClimateSettingScheduleRow.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import {
  useClimateSettingSchedules,
  type UseClimateSettingSchedulesData,
} from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedules.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { LoadingToast } from 'lib/ui/LoadingToast/LoadingToast.js'
import { Snackbar } from 'lib/ui/Snackbar/Snackbar.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'
import { Caption } from 'lib/ui/typography/Caption.js'

export const NestedClimateSettingScheduleTable = withRequiredCommonProps(
  ClimateSettingScheduleTable
)

export interface ClimateSettingScheduleTableProps extends CommonProps {
  deviceId: string
  disableSearch?: boolean
  onClimateSettingScheduleClick?: (climateSettingScheduleId: string) => void
  preventDefaultOnClimateSettingScheduleClick?: boolean
  climateSettingScheduleFilter?: (
    climateSettingSchedule: ClimateSettingSchedule,
    searchInputValue: string
  ) => boolean
  climateSettingScheduleComparator?: (
    climateSettingScheduleA: ClimateSettingSchedule,
    climateSettingScheduleB: ClimateSettingSchedule
  ) => number
  heading?: string | null
}

const defaultClimateSettingScheduleFilter = (
  climateSettingSchedule: ClimateSettingSchedule,
  searchInputValue: string
): boolean => {
  const value = searchInputValue.trim().toLowerCase()
  if (value === '') return true
  const name = climateSettingSchedule.name ?? ''
  return name.trim().toLowerCase().includes(value)
}

export function ClimateSettingScheduleTable({
  deviceId,
  disableSearch = false,
  onClimateSettingScheduleClick = () => {},
  preventDefaultOnClimateSettingScheduleClick = false,
  climateSettingScheduleFilter = defaultClimateSettingScheduleFilter,
  climateSettingScheduleComparator = compareByCreatedAtDesc,
  heading = t.climateSettingSchedules,
  disableLockUnlock = false,
  disableDeleteAccessCode = false,
  onBack,
  className,
  disableCreateAccessCode,
  disableEditAccessCode,
}: ClimateSettingScheduleTableProps): JSX.Element {
  useComponentTelemetry('ClimateSettingScheduleTable')

  const { climateSettingSchedules, isInitialLoading, isError, error } =
    useClimateSettingSchedules({
      device_id: deviceId,
    })

  const [searchInputValue, setSearchInputValue] = useState('')
  const [
    selectedViewClimateSettingScheduleId,
    setSelectedViewClimateSettingScheduleId,
  ] = useState<string | null>(null)

  const filteredClimateSettingSchedules = useMemo(
    () =>
      climateSettingSchedules
        ?.filter((schedule) =>
          climateSettingScheduleFilter(schedule, searchInputValue)
        )
        ?.sort(climateSettingScheduleComparator) ?? [],
    [
      climateSettingSchedules,
      searchInputValue,
      climateSettingScheduleFilter,
      climateSettingScheduleComparator,
    ]
  )

  const handleClimateSettingScheduleClick = useCallback(
    (climateSettingScheduleId: string): void => {
      onClimateSettingScheduleClick(climateSettingScheduleId)
      if (preventDefaultOnClimateSettingScheduleClick) return
      setSelectedViewClimateSettingScheduleId(climateSettingScheduleId)
    },
    [
      onClimateSettingScheduleClick,
      preventDefaultOnClimateSettingScheduleClick,
      setSelectedViewClimateSettingScheduleId,
    ]
  )

  if (selectedViewClimateSettingScheduleId != null) {
    return (
      <NestedClimateSettingScheduleDetails
        climateSettingScheduleId={selectedViewClimateSettingScheduleId}
        disableLockUnlock={disableLockUnlock}
        disableCreateAccessCode={disableCreateAccessCode}
        disableEditAccessCode={disableEditAccessCode}
        disableDeleteAccessCode={disableDeleteAccessCode}
        onBack={() => {
          setSelectedViewClimateSettingScheduleId(null)
        }}
        className={className}
      />
    )
  }

  return (
    <div className={classNames('seam-table', className)}>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        {heading != null ? (
          <TableTitle>
            {heading ?? t.climateSettingSchedules}{' '}
            <Caption>({filteredClimateSettingSchedules.length})</Caption>
          </TableTitle>
        ) : (
          <div className='seam-fragment' />
        )}
        <div className='seam-table-header-loading-wrap'>
          <LoadingToast
            isLoading={isInitialLoading}
            label={t.loading}
            top={-20}
          />
        </div>
        {!disableSearch && (
          <SearchTextField
            value={searchInputValue}
            onChange={setSearchInputValue}
            disabled={(climateSettingSchedules?.length ?? 0) === 0}
          />
        )}
      </TableHeader>
      <TableBody>
        <Content
          climateSettingSchedules={filteredClimateSettingSchedules}
          onClimateSettingScheduleClick={handleClimateSettingScheduleClick}
        />
      </TableBody>

      {isError && (
        <Snackbar
          message={
            error?.message ??
            'An unknown error occurred fetching climate settings. Please try again.'
          }
          variant='error'
          isOpen={isError}
          onClose={() => {}}
          disableCloseButton
        />
      )}
    </div>
  )
}

function Content(props: {
  climateSettingSchedules: Array<UseClimateSettingSchedulesData[number]>
  onClimateSettingScheduleClick: (climateSettingScheduleId: string) => void
}): JSX.Element {
  const { climateSettingSchedules, onClimateSettingScheduleClick } = props

  if (climateSettingSchedules.length === 0) {
    return (
      <EmptyPlaceholder>{t.noClimateSettingSchedulesMessage}</EmptyPlaceholder>
    )
  }

  return (
    <>
      {climateSettingSchedules.map((schedule) => (
        <ClimateSettingScheduleRow
          climateSettingSchedule={schedule}
          key={schedule.climate_setting_schedule_id}
          onClick={() => {
            onClimateSettingScheduleClick(schedule.climate_setting_schedule_id)
          }}
        />
      ))}
    </>
  )
}

const t = {
  climateSettingSchedules: 'Climate setting schedules',
  noClimateSettingSchedulesMessage:
    'Sorry, no climate setting schedules were found',
  loading: 'Loading schedules',
}

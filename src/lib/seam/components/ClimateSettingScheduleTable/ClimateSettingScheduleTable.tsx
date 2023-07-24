import classNames from 'classnames'
import { compareByCreatedAtDesc } from 'lib/dates.js'
import {
  useClimateSettingSchedules,
  type UseClimateSettingSchedulesData,
} from 'lib/seam/thermostats/climate-setting-schedules/use-climate-setting-schedules.js'
import { EmptyPlaceholder } from 'lib/ui/Table/EmptyPlaceholder.js'
import { TableBody } from 'lib/ui/Table/TableBody.js'
import { TableHeader } from 'lib/ui/Table/TableHeader.js'
import { TableTitle } from 'lib/ui/Table/TableTitle.js'
import { SearchTextField } from 'lib/ui/TextField/SearchTextField.js'
import { ContentHeader } from 'lib/ui/layout/ContentHeader.js'
import { Caption } from 'lib/ui/typography/Caption.js'
import { useCallback, useMemo, useState } from 'react'
import type { AccountFilter } from '../DeviceTable/DeviceHealthBar.js'
import { ClimateSettingScheduleRow } from './ClimateSettingScheduleRow.js'

type ClimateSettingSchedule = UseClimateSettingSchedulesData[number]

export interface ClimateSettingScheduleTableProps {
  deviceId?: string
  disableSearch?: boolean
  climateSettingScheduleFilter?: (
    ClimateSettingSchedule: ClimateSettingSchedule,
    searchInputValue: string
  ) => boolean
  climateSettingScheduleComparator?: (
    ClimateSettingScheduleA: ClimateSettingSchedule,
    ClimateSettingScheduleB: ClimateSettingSchedule
  ) => number
  onClimateSettingScheduleClick?: (ClimateSettingScheduleId: string) => void
  preventDefaultOnClimateSettingScheduleClick?: boolean
  onBack?: () => void
  className?: string
}

const defaultClimateSettingScheduleFilter = (
  schedule: ClimateSettingSchedule,
  searchInputValue: string
): boolean => {
  const value = searchInputValue.trim()
  if (value === '') return true
  return new RegExp(value, 'i').test(schedule.name ?? '')
}

export function ClimateSettingScheduleTable({
  deviceId,
  disableSearch = false,
  onClimateSettingScheduleClick = () => {},
  preventDefaultOnClimateSettingScheduleClick = false,
  onBack,
  climateSettingScheduleFilter = defaultClimateSettingScheduleFilter,
  climateSettingScheduleComparator = compareByCreatedAtDesc,
  className,
}: ClimateSettingScheduleTableProps = {}): JSX.Element {
  const { climateSettingSchedules, isLoading, isError, error } =
    useClimateSettingSchedules({
      device_id: deviceId,
    })

  const [
    selectedClimateSettingScheduleId,
    setSelectedClimateSettingScheduleId,
  ] = useState<string | null>(null)
  const [searchInputValue, setSearchInputValue] = useState('')

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
      setSelectedClimateSettingScheduleId(climateSettingScheduleId)
    },
    [
      onClimateSettingScheduleClick,
      preventDefaultOnClimateSettingScheduleClick,
      setSelectedClimateSettingScheduleId,
    ]
  )

  // TODO: details page
  // if (selectedClimateSettingScheduleId != null) {
  //   return (
  //     <ClimateSettingScheduleDetails
  //       className={className}
  //       ClimateSettingScheduleId={selectedClimateSettingScheduleId}
  //       onBack={() => {
  //         setSelectedClimateSettingScheduleId(null)
  //       }}
  //       disableLockUnlock={disableLockUnlock}
  //     />
  //   )
  // }

  if (isLoading) {
    return <p className={className}>...</p>
  }

  if (isError) {
    return <p className={className}>{error?.message}</p>
  }

  return (
    <div className={classNames('seam-ClimateSettingSchedule-table', className)}>
      <ContentHeader onBack={onBack} />
      <TableHeader>
        <TableTitle>
          {t.climateSettingSchedules}{' '}
          <Caption>({filteredClimateSettingSchedules.length})</Caption>
        </TableTitle>
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
    </div>
  )
}

function Content(props: {
  climateSettingSchedules: Array<UseClimateSettingSchedulesData[number]>
  onClimateSettingScheduleClick: (ClimateSettingScheduleId: string) => void
}): JSX.Element {
  const { climateSettingSchedules, onClimateSettingScheduleClick } = props
  const [filter, setFilter] = useState<
    AccountFilter | ClimateSettingScheduleFilter | null
  >(null)

  if (climateSettingSchedules.length === 0) {
    return (
      <EmptyPlaceholder>{t.noClimateSettingSchedulesMessage}</EmptyPlaceholder>
    )
  }

  // const filteredClimateSettingSchedules = climateSettingSchedules.filter(
  //   (schedule) => {
  //     if (filter === null) {
  //       return true
  //     }

  //     if (filter === 'account_issues') {
  //       return (
  //         schedule.errors.filter(
  //           (error) => 'is_connected_account_error' in error
  //         ).length > 0
  //       )
  //     }

  //     if (filter === 'ClimateSettingSchedule_issues') {
  //       return (
  //         ClimateSettingSchedule.errors.filter(
  //           (error) => 'is_ClimateSettingSchedule_error' in error
  //         ).length > 0
  //       )
  //     }

  //     return true
  //   }
  // )

  //TODO: figure out how to filter
  const filteredClimateSettingSchedules = climateSettingSchedules

  return (
    <>
      {/* 
      TODO: probably remove
      <ClimateSettingScheduleHealthBar
        ClimateSettingSchedules={ClimateSettingSchedules}
        filter={filter}
        onFilterSelect={setFilter}
      /> */}
      {filteredClimateSettingSchedules.map((schedule) => (
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
  climateSettingSchedules: 'climateSettingSchedules',
  noClimateSettingSchedulesMessage:
    'Sorry, no climate setting schedules were found',
}

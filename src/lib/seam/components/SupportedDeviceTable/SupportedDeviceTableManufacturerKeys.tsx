import type { Manufacturer } from '@seamapi/types/devicedb'
import classNames from 'classnames'

import { CopyIcon } from 'lib/icons/Copy.js'
import {
  type CommonProps,
  withRequiredCommonProps,
} from 'lib/seam/components/common-props.js'
import { useComponentTelemetry } from 'lib/telemetry/index.js'
import { copyToClipboard } from 'lib/ui/clipboard.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'

import { useManufacturers } from './use-manufacturers.js'

export interface SupportedDeviceTableManufacturerKeysProps
  extends CommonProps {}

export const NestedSupportedDeviceTableManufacturerKeys =
  withRequiredCommonProps(SupportedDeviceTableManufacturerKeys)

export function SupportedDeviceTableManufacturerKeys({
  className,
}: SupportedDeviceTableManufacturerKeysProps = {}): JSX.Element {
  useComponentTelemetry('SupportedDeviceTableManufacturerKeys')

  const { manufacturers } = useManufacturers()

  return (
    <div
      className={classNames(
        'supported-device-table-manufacturer-keys',
        className
      )}
    >
      {manufacturers?.map((manufacturer) => (
        <ManufacturerKey
          key={manufacturer.manufacturer_id}
          manufacturer={manufacturer}
        />
      ))}
    </div>
  )
}

function ManufacturerKey({
  manufacturer,
}: {
  manufacturer: Manufacturer
}): JSX.Element {
  const key = manufacturer.display_name
  return (
    <div className='seam-manufacturer-key'>
      <div className='seam-manufacturer-key-value'>{key}</div>
      <MenuItem
        className='seam-copy-button'
        onClick={() => {
          void copyToClipboard(key)
        }}
      >
        <CopyIcon />
      </MenuItem>
    </div>
  )
}

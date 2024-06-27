import { Button, Dialog, DialogActions } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { SupportedDeviceTable } from 'lib/seam/components/SupportedDeviceTable/SupportedDeviceTable.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase the supported devices table.
 *
 * > **💡 The Storybook uses sample data for demonstration purposes!**
 * >
 * > ⚡ To see the SupportedDeviceTable with live data, visit https://react.seam.co/examples/basic/
 */
const meta: Meta<typeof SupportedDeviceTable> = {
  title: 'Components/SupportedDeviceTable',
  component: SupportedDeviceTable,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/6nCfNVHmYQ7wxhnFOpFBm6/Supported-devices?type=design&node-id=171-36651&mode=design&t=JkLcfU9cdo7cMpHR-4',
    },
  },
}

export default meta

type Story = StoryObj<typeof SupportedDeviceTable>

export const Content: Story = {}

export const NoFilter: Story = {
  render: (props) => <SupportedDeviceTable {...props} disableFilter />,
}

export const ChooseManufacturers: Story = {
  render: (props) => (
    <SupportedDeviceTable
      {...props}
      manufacturers={['August=cfe546ca-7a99-48e0-a665-4304dca85b4e', '4SUITES']}
    />
  ),
}

export const ExcludeManufacturers: Story = {
  render: (props) => (
    <SupportedDeviceTable
      {...props}
      excludedManufacturers={[
        'August=cfe546ca-7a99-48e0-a665-4304dca85b4e',
        '4SUITES',
      ]}
    />
  ),
}

export const IncludeIf: Story = {
  render: (props) => (
    <SupportedDeviceTable
      {...props}
      includeIf={[
        'software_features.can_remotely_unlock',
        'physical_properties.has_physical_key',
      ]}
    />
  ),
}

export const ExcludeIf: Story = {
  render: (props) => (
    <SupportedDeviceTable
      {...props}
      excludeIf={['software_features.can_remotely_unlock']}
    />
  ),
}

export const InsideModal: Story = {
  render: (props) => {
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
          <SupportedDeviceTable {...props} />

          <DialogActions
            sx={{ justifyContent: 'center', marginBottom: '16px' }}
          >
            <Button variant='outlined' onClick={toggleOpen}>
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  },
}

import { Close as CloseIcon } from '@mui/icons-material'
import { Button, Dialog, DialogActions, IconButton } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'

import { DeviceDetails } from 'lib/seam/components/DeviceDetails/DeviceDetails.js'
import { seamComponentsClassName } from 'lib/seam/SeamProvider.js'
import { useToggle } from 'lib/ui/use-toggle.js'

/**
 * These stories showcase the device details.
 */
const meta: Meta<typeof DeviceDetails> = {
  title: 'Components/DeviceDetails',
  component: DeviceDetails,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Seam-Components?type=design&node-id=358-39439&mode=design&t=4OQwfRB8Mw8kT1rw-4',
    },
  },
}

export default meta

type Story = StoryObj<typeof DeviceDetails>

export const Content: Story = {
  render: (props, { globals }) => (
    <DeviceDetails
      {...props}
      deviceId={props.deviceId ?? globals['deviceId']}
    />
  ),
}

export const InsideModal: Story = {
  render: (props, { globals }) => {
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog
          className={seamComponentsClassName}
          open={open}
          fullWidth
          maxWidth='sm'
          onClose={toggleOpen}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: '4px',
              right: '8px',
            }}
          >
            <CloseIcon />
          </IconButton>
          <DeviceDetails
            {...props}
            deviceId={props.deviceId ?? globals['deviceId']}
          />
          <DialogActions
            sx={{ justifyContent: 'center', marginBottom: '16px' }}
          >
            <Button variant='outlined'>Done</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  },
}

export const DisableLockUnlock: Story = {
  render: (props, { globals }) => (
    <DeviceDetails
      {...props}
      deviceId={props.deviceId ?? globals['deviceId']}
      disableLockUnlock
    />
  ),
}

export const DeviceOffline: Story = {
  render: (props) => <DeviceDetails {...props} deviceId='device2' />,
}

export const ThermostatDevice: Story = {
  render: (props) => <DeviceDetails {...props} deviceId='device5' />,
}

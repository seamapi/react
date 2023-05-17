import { Close as CloseIcon } from '@mui/icons-material'
import { Button, Dialog, DialogActions, IconButton } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { Seam } from 'seamapi'

import { DeviceDetails } from 'lib/ui/DeviceDetails/DeviceDetails.js'
import useToggle from 'lib/use-toggle.js'

/**
 * These stories showcase the device details.
 */
const meta: Meta<typeof DeviceDetails> = {
  title: 'Example/DeviceDetails',
  component: DeviceDetails,
  tags: ['autodocs'],
  loaders: [
    async ({ globals: { publishableKey, userIdentifierKey } }) => {
      const res = await Seam.getClientSessionToken({
        publishableKey,
        userIdentifierKey,
      })
      if (!res.ok || res.client_session?.token == null) {
        throw new Error('Failed to get client access token')
      }
      const client = new Seam({
        clientSessionToken: res.client_session.token,
      })
      const devices = await client.devices.list()
      return {
        deviceId: devices[0]?.device_id,
      }
    },
  ],
}

export default meta

type Story = StoryObj<typeof DeviceDetails>

export const Content: Story = {
  render: (props, { loaded }) => (
    <DeviceDetails {...props} deviceId={props.deviceId ?? loaded['deviceId']} />
  ),
}

export const InsideModal: Story = {
  render: (props, { loaded }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, toggleOpen] = useToggle()
    return (
      <>
        <Button onClick={toggleOpen}>Open Modal</Button>
        <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
          <IconButton
            sx={{
              position: 'absolute',
              top: '4px',
              right: '8px',
            }}
          >
            <CloseIcon />
          </IconButton>
          <div className='seam-components'>
            <DeviceDetails
              {...props}
              deviceId={props.deviceId ?? loaded['deviceId']}
            />
          </div>
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

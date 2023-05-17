import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { Seam } from 'seamapi'

import { byCreatedAt } from 'lib/sort-by.js'
import { AccessCodeTable } from 'lib/ui/AccessCodeTable/AccessCodeTable.js'
import useToggle from 'lib/use-toggle.js'

/**
 * These stories showcase the access code table.
 */
const meta: Meta<typeof AccessCodeTable> = {
  title: 'Example/AccessCodeTable',
  component: AccessCodeTable,
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
      const devices = (await client.devices.list())?.sort(byCreatedAt) ?? []
      const deviceWithCodes = devices.find(
        ({ properties }) => properties?.name.toLowerCase() === 'front door'
      )
      return {
        deviceId: deviceWithCodes?.device_id,
      }
    },
  ],
}

export default meta

type Story = StoryObj<typeof AccessCodeTable>

export const Content: Story = {
  render: (props, { loaded }) => (
    <AccessCodeTable
      {...props}
      deviceId={props.deviceId ?? loaded['deviceId']}
    />
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
          <div className='seam-components'>
            <AccessCodeTable
              {...props}
              deviceId={props.deviceId ?? loaded['deviceId']}
            />
          </div>
        </Dialog>
      </>
    )
  },
}

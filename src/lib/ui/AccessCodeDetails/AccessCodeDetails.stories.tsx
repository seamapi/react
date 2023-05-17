import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import { Seam } from 'seamapi'

import { byCreatedAt } from 'lib/sort-by.js'
import { AccessCodeDetails } from 'lib/ui/AccessCodeDetails/AccessCodeDetails.js'
import useToggle from 'lib/use-toggle.js'

/**
 * These stories showcase access code details.
 */
const meta: Meta<typeof AccessCodeDetails> = {
  title: 'Example/AccessCodeDetails',
  component: AccessCodeDetails,
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
      if (deviceWithCodes == null) return { accessCodeId: null }
      const accessCodes =
        (
          await client.accessCodes.list({
            device_id: deviceWithCodes?.device_id,
          })
        )?.sort(byCreatedAt) ?? []
      return {
        accessCodeId: accessCodes[0]?.access_code_id,
      }
    },
  ],
}

export default meta

type Story = StoryObj<typeof AccessCodeDetails>

export const Content: Story = {
  render: (props, { loaded }) => (
    <AccessCodeDetails
      {...props}
      accessCodeId={props.accessCodeId ?? loaded['accessCodeId']}
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
            <AccessCodeDetails
              {...props}
              accessCodeId={props.accessCodeId ?? loaded['accessCodeId']}
            />
          </div>
        </Dialog>
      </>
    )
  },
}

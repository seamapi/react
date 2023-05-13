import { Button, Dialog } from '@mui/material'
import type { Meta, StoryObj } from '@storybook/react'
import type { AccessCode } from 'seamapi'

import {
  AccessCodeTableContent,
  type AccessCodeTableContentProps,
} from 'lib/ui/AccessCodeTable/AccessCodeTableContent.js'
import useToggle from 'lib/use-toggle.js'

const accessCodes: AccessCode[] = [
  {
    access_code_id: 'd53b5bf1-a8b0-4d35-b679-e82a50880422',
    type: 'time_bound',
    code: '1234',
    created_at: '2023-05-13T01:00:14Z',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Guest - Gonzalez',
    starts_at: '2023-05-13T01:00:14Z',
    ends_at: '2023-05-14T01:00:14Z',
  },
  {
    access_code_id: '61158a8d-2d3b-43df-8ce8-7881a0c0eb78',
    type: 'time_bound',
    code: '1234',
    created_at: '2023-03-13T01:00:14Z',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Guest - Thompson',
    starts_at: '2023-03-14T01:00:14Z',
    ends_at: '2023-03-15T01:00:14Z',
  },
  {
    access_code_id: '2a246245-ea14-474d-b470-c25c7495b651',
    type: 'ongoing',
    code: '1234',
    created_at: '2023-01-13T01:00:14Z',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Guest - Kranz',
  },
  {
    access_code_id: '1ba5dd41-0cdf-496d-82a2-1538137a02d6',
    type: 'ongoing',
    code: '1234',
    created_at: '2023-05-11T01:00:14Z',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Sparkle Cleaners',
  },
  {
    access_code_id: '36e15525-c20f-49e7-a58c-b95a194b45ab',
    type: 'ongoing',
    code: '1234',
    created_at: '2023-05-01T01:00:14Z',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Guest - yang',
  },
  {
    access_code_id: 'dfadce05-b323-4454-a4da-e764072caeec',
    type: 'ongoing',
    code: '1234',
    created_at: '2023-05-03T01:00:14Z',
    device_id: 'some_device_id',
    status: 'set',
    name: 'Astro Plumbing',
  },
]

/**
 * These stories showcase the device manager.
 */
const meta: Meta<typeof AccessCodeTableContent> = {
  title: 'Example/AccessCodeTable',
  component: AccessCodeTableContent,
  tags: ['autodocs'],
  args: {
    accessCodes,
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeTableContent>

export const Content: Story = {}

export const InsideModal: Story = {
  render: InsideModalComponent,
}

function InsideModalComponent(props: AccessCodeTableContentProps): JSX.Element {
  const [open, toggleOpen] = useToggle()
  return (
    <>
      <Button onClick={toggleOpen}>Open Modal</Button>
      <Dialog open={open} fullWidth maxWidth='sm' onClose={toggleOpen}>
        <div className='seam-components'>
          <AccessCodeTableContent {...props} />
        </div>
      </Dialog>
    </>
  )
}

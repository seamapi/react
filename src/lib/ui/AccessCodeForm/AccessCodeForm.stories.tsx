import type { Meta, StoryObj } from '@storybook/react'

import { AccessCodeForm } from 'lib/ui/AccessCodeForm/AccessCodeForm.js'

const meta: Meta<typeof AccessCodeForm> = {
  title: 'Components/AccessCodeForm',
  component: AccessCodeForm,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/Su3VO6yupz4yxe88fv0Uqa/Seam-Components?node-id=240%3A37367&mode=dev',
    },
  },
  args: {
    device: {
      device_id: 'device_1',
      workspace_id: 'workspace_1',
      display_name: 'Device 1',
      custom_metadata: {},
      location: {},
      properties: {
        name: '',
        manufacturer: undefined,
        model: {
          display_name: '',
          manufacturer_display_name: '',
        },
        online: false,
        battery: undefined,
        image_url: undefined,
        image_alt_text: undefined,
        appearance: {
          name: 'Device 1',
        },
      },
      device_type: 'yale_lock',
      connected_account_id: '',
      capabilities_supported: [],
      errors: [],
      warnings: [],
      created_at: '',
      is_managed: true,
    },
  },
}

export default meta

type Story = StoryObj<typeof AccessCodeForm>

export const UnknownError: Story = {
  args: {
    responseErrors: {
      unknown: 'The code could not be saved. Please try again.',
    },
  },
  render: (props) => <AccessCodeForm {...props} />,
}

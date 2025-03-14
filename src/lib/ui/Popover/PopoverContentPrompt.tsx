import { Button } from 'lib/ui/Button.js'

export interface PopoverContentPromptProps {
  onConfirm?: () => void
  onCancel?: () => void
  prompt?: string
  description?: string
  confirmText?: string
  cancelText?: string
  confirmLoading?: boolean
}

export function PopoverContentPrompt(
  props: PopoverContentPromptProps
): JSX.Element {
  const {
    confirmText = t.confirm,
    cancelText = t.cancel,
    confirmLoading = false,
    prompt = t.areYouSure,
    description,
    onConfirm,
    onCancel,
  } = props

  return (
    <div className='seam-popover-content-prompt'>
      <div>
        <div className='seam-popover-content-prompt-text'>{prompt}</div>
        {description != null && (
          <div className='seam-popover-content-prompt-description'>
            {description}
          </div>
        )}
      </div>
      <div className='seam-popover-content-prompt-buttons'>
        <Button
          variant='solid'
          onClick={onConfirm}
          loading={confirmLoading}
          size='small'
        >
          {confirmText}
        </Button>

        <Button variant='danger' size='small' onClick={onCancel}>
          {cancelText}
        </Button>
      </div>
    </div>
  )
}

const t = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  areYouSure: 'Are you sure?',
}

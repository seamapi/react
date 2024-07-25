import type { AccessCode } from '@seamapi/types/connect'

import { CopyIcon } from 'lib/icons/Copy.js'
import { useDeleteAccessCode } from 'lib/seam/access-codes/use-delete-access-code.js'
import { Button } from 'lib/ui/Button.js'
import { copyToClipboard } from 'lib/ui/clipboard.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'
import { MoreActionsMenu } from 'lib/ui/Menu/MoreActionsMenu.js'
import { useToggle } from 'lib/ui/use-toggle.js'

export interface AccessCodeMenuProps {
  accessCode: AccessCode
  onEdit: () => void
  onDeleteSuccess: () => void
  onViewDetails: () => void
  disableEditAccessCode: boolean
  disableDeleteAccessCode: boolean
}

export function AccessCodeMenu(props: AccessCodeMenuProps): JSX.Element {
  const [deleteConfirmationVisible, toggleDeleteConfirmation] = useToggle()

  return (
    <MoreActionsMenu
      menuProps={{
        backgroundProps: {
          className: 'seam-table-action-menu',
        },
        onClose: () => {
          if (deleteConfirmationVisible) {
            toggleDeleteConfirmation()
          }
        },
      }}
    >
      <Content
        {...props}
        deleteConfirmationVisible={deleteConfirmationVisible}
        toggleDeleteConfirmation={toggleDeleteConfirmation}
      />
    </MoreActionsMenu>
  )
}

interface ContentProps extends AccessCodeMenuProps {
  deleteConfirmationVisible: boolean
  toggleDeleteConfirmation: () => void
}

function Content({
  accessCode,
  onViewDetails,
  disableEditAccessCode,
  disableDeleteAccessCode,
  onEdit,
  onDeleteSuccess,
  deleteConfirmationVisible,
  toggleDeleteConfirmation,
}: ContentProps): JSX.Element {
  const deleteAccessCode = useDeleteAccessCode()
  const isAccessCodeBeingRemoved = accessCode.status === 'removing'

  if (deleteConfirmationVisible) {
    return (
      <div className='seam-delete-confirmation'>
        <span>{t.deleteCodeConfirmation}</span>
        <div className='seam-actions'>
          <Button disabled={deleteAccessCode.isPending}>
            {t.cancelDelete}
          </Button>
          <Button
            variant='solid'
            disabled={deleteAccessCode.isPending}
            onClick={() => {
              deleteAccessCode.mutate(
                {
                  access_code_id: accessCode.access_code_id,
                },
                {
                  onSuccess: onDeleteSuccess,
                }
              )
            }}
          >
            {t.confirmDelete}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <MenuItem
        onClick={() => {
          void copyToClipboard(accessCode.code ?? '')
        }}
      >
        <div className='seam-menu-item-copy'>
          <span>
            {t.copyCode} - {accessCode.code}
          </span>
          <CopyIcon />
        </div>
      </MenuItem>
      <div className='seam-divider' />
      <MenuItem onClick={onViewDetails}>{t.viewCodeDetails}</MenuItem>
      {!disableEditAccessCode && !isAccessCodeBeingRemoved && (
        <MenuItem onClick={onEdit}>{t.editCode}</MenuItem>
      )}
      {!disableDeleteAccessCode && !isAccessCodeBeingRemoved && (
        <>
          <div className='seam-divider' />
          <MenuItem
            onClick={(event) => {
              event.stopPropagation() // Prevent hiding menu on outside click
              toggleDeleteConfirmation()
            }}
            preventDefaultOnClick
            className='seam-text-danger'
          >
            {t.deleteCode}
          </MenuItem>
        </>
      )}
    </>
  )
}

const t = {
  copyCode: 'Copy code',
  codeIssue: 'code issue',
  codeIssues: 'code issues',
  editCode: 'Edit code',
  viewCodeDetails: 'View code details',
  deleteCode: 'Delete code',
  deleteCodeConfirmation: 'Delete this code and data?',
  cancelDelete: 'Cancel',
  confirmDelete: 'Delete',
}

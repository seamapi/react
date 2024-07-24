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
  onDelete: () => void
  onViewDetails: () => void
  disableEditAccessCode: boolean
  disableDeleteAccessCode: boolean
  deleteConfirmationVisible: boolean
  toggleDeleteConfirmation: () => void
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

function Content({
  accessCode,
  onViewDetails,
  disableEditAccessCode,
  disableDeleteAccessCode,
  onEdit,
  onDelete,
  deleteConfirmationVisible,
  toggleDeleteConfirmation,
}: AccessCodeMenuProps): JSX.Element {
  const deleteAccessCode = useDeleteAccessCode()

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
                  onSuccess: onDelete,
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
      {!disableEditAccessCode && (
        <MenuItem onClick={onEdit}>{t.editCode}</MenuItem>
      )}
      {!disableDeleteAccessCode && (
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

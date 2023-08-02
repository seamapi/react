import { CopyIcon } from 'lib/icons/Copy.js'
import type { UseAccessCodeData } from 'lib/seam/access-codes/use-access-code.js'
import { useDeleteAccessCode } from 'lib/seam/access-codes/use-delete-access-code.js'
import { Button } from 'lib/ui/Button.js'
import { copyToClipboard } from 'lib/ui/clipboard.js'
import { MenuItem } from 'lib/ui/Menu/MenuItem.js'
import { MoreActionsMenu } from 'lib/ui/Menu/MoreActionsMenu.js'
import { useToggle } from 'lib/ui/use-toggle.js'

export interface AccessCodeMenuProps {
  accessCode: NonNullable<UseAccessCodeData>
  onEdit: () => void
  onViewDetails: () => void
  disableEditAccessCode: boolean
  disableDeleteAccessCode: boolean
}

export function AccessCodeMenu(props: AccessCodeMenuProps): JSX.Element {
  return (
    <MoreActionsMenu
      menuProps={{
        backgroundProps: {
          className: 'seam-access-code-table-action-menu',
        },
      }}
    >
      <Content {...props} />
    </MoreActionsMenu>
  )
}

function Content({
  accessCode,
  onViewDetails,
  disableEditAccessCode,
  disableDeleteAccessCode,
  onEdit,
}: AccessCodeMenuProps): JSX.Element {
  const [deleteConfirmationVisible, toggleDeleteConfirmation] = useToggle()

  const deleteAccessCode = useDeleteAccessCode()

  if (deleteConfirmationVisible) {
    return (
      <div className='seam-delete-confirmation'>
        <span>{t.deleteCodeConfirmation}</span>
        <div className='seam-actions'>
          <Button
            onClick={toggleDeleteConfirmation}
            disabled={deleteAccessCode.isLoading}
          >
            {t.cancelDelete}
          </Button>
          <Button
            variant='solid'
            disabled={deleteAccessCode.isLoading}
            onClick={() => {
              deleteAccessCode.mutate({
                access_code_id: accessCode.access_code_id,
              })
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

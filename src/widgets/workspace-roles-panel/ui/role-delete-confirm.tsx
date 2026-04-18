import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/primitives/alert-dialog'

interface RoleDeleteConfirmProps {
  roleName: string
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function RoleDeleteConfirm({
  roleName,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: RoleDeleteConfirmProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the <span className="font-semibold text-primary">"{roleName}"</span> role. 
            Members currently assigned to this role will lose its associated permissions.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
<AlertDialogAction
          onClick={(e) => {
            e.preventDefault()
            onConfirm()
          }}
          className="bg-danger-primary text-on-color hover:bg-danger-primary-hover"
          disabled={isDeleting}
        >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Role'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

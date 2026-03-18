import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { ScrollArea } from '@/shared/ui/primitives/scroll-area'
import { usePageCollaborators } from '@/features/pages/fetch-page-collaborators'
import { mapRemovePageCollaboratorError, useRemovePageCollaborator  } from '@/features/pages/remove-page-collaborator'
import { AddPageCollaboratorsDialog } from '@/features/pages/add-page-collaborators'
import { useAuth } from '@/shared/hooks'

interface ManageCollaboratorsDialogProps {
  pageId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Dialog for viewing and removing page collaborators.
 *
 * Lists all current collaborators with a Remove button per row.
 * Creator row is greyed out + labelled "(Creator)" — matches server guard.
 * Footer "+ Add Collaborators" button opens AddPageCollaboratorsDialog inline.
 *
 * @layer Features
 * @module pages/manage-page-collaborators
 */
export function ManageCollaboratorsDialog({
  pageId,
  open,
  onOpenChange,
}: ManageCollaboratorsDialogProps) {
  const { userId } = useAuth()
  const [addOpen, setAddOpen] = useState(false)

  const { data: collaborators, isLoading } = usePageCollaborators(pageId)
  const { mutate: removeCollaborator, isPending: isRemoving } =
    useRemovePageCollaborator()

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  const handleRemove = (targetUserId: string, name: string) => {
    removeCollaborator(
      { pageId, userId: targetUserId },
      {
        onSuccess: () => toast.success(`Removed ${name}`),
        onError: (err) => toast.error(mapRemovePageCollaboratorError(err)),
      },
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Collaborators</DialogTitle>
            <DialogDescription>
              People with access to this page
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[400px] rounded-md border p-2">
            {isLoading ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                Loading...
              </div>
            ) : !collaborators || collaborators.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                No collaborators yet.
              </div>
            ) : (
              <div className="space-y-1">
                {collaborators.map((collab) => {
                  const isCreator = collab.userId === userId
                  const name = collab.user.fullName
                  const email = collab.user.email
                  const avatar = collab.user.avatarUrl ?? ''
                  return (
                    <div
                      key={collab.userId}
                      className="flex items-center gap-3 rounded-lg p-3"
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {name}
                          {isCreator && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (Creator)
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {email}
                        </span>
                      </div>
                      {!isCreator && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          disabled={isRemoving}
                          onClick={() => handleRemove(collab.userId, name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddOpen(true)}
            >
              + Add Collaborators
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested add-collaborators dialog */}
      <AddPageCollaboratorsDialog
        pageId={pageId}
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </>
  )
}

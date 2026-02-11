import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { ScrollArea } from '@/shared/ui/primitives/scroll-area'
import { useAddCollaborators } from '../hooks'
import { addCollaboratorsSchema } from '../model'
import { mapAddCollaboratorsError } from '../lib'

interface WorkspaceMember {
  id: string
  user: {
    id: string
    fullName: string
    email: string
    avatarUrl: string | null
  }
}

interface AddCollaboratorsDialogProps {
  boardId: string
  workspaceMembers: WorkspaceMember[]
  currentCollaboratorIds: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCollaboratorsDialog({
  boardId,
  workspaceMembers,
  currentCollaboratorIds,
  open,
  onOpenChange,
}: AddCollaboratorsDialogProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: addCollaborators, isPending } = useAddCollaborators()

  // Filter out current collaborators
  const availableMembers = workspaceMembers.filter(
    (member) => !currentCollaboratorIds.includes(member.user.id),
  )

  const form = useForm({
    defaultValues: {
      boardId,
      userIds: [] as string[],
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        const result = await addCollaborators(value)
        const { addedCount } = result.addBoardCollaborators
        toast.success(`Added ${addedCount} collaborator(s)`)
        form.reset()
        onOpenChange(false)
      } catch (error: unknown) {
        const message = mapAddCollaboratorsError(error)
        setRootError(message)
        toast.error(message)
      }
    },
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (availableMembers.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Collaborators</DialogTitle>
            <DialogDescription>
              All workspace members are already collaborators on this board.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Collaborators</DialogTitle>
          <DialogDescription>
            Select workspace members to add to this board
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          {rootError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {rootError}
            </div>
          )}

          <form.Field
            name="userIds"
            validators={{
              onChange: ({ value }) => {
                const result =
                  addCollaboratorsSchema.shape.userIds.safeParse(value)
                if (!result.success) return result.error.issues[0].message
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-2">
                    {availableMembers.map((member) => {
                      const isSelected = field.state.value.includes(
                        member.user.id,
                      )
                      return (
                        <button
                          key={member.user.id}
                          type="button"
                          onClick={() => {
                            const newValue = isSelected
                              ? field.state.value.filter(
                                  (id) => id !== member.user.id,
                                )
                              : [...field.state.value, member.user.id]
                            field.handleChange(newValue)
                          }}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent',
                            isSelected && 'bg-accent',
                          )}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.user.avatarUrl || ''} />
                            <AvatarFallback>
                              {getInitials(member.user.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-1 flex-col items-start">
                            <span className="text-sm font-medium">
                              {member.user.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {member.user.email}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors.join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit]}
              children={([canSubmit]) => (
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {isPending ? 'Adding...' : 'Add Collaborators'}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

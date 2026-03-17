import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { useAddPageCollaborators } from '../hooks/use-add-page-collaborators'
import { mapAddPageCollaboratorsError } from '../lib/error-mapping'
import type { PageRole } from '@/gql/graphql'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/primitives/button'
import { DialogFooter } from '@/shared/ui/primitives/dialog'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/ui/primitives/avatar'
import { ScrollArea } from '@/shared/ui/primitives/scroll-area'

interface WorkspaceMember {
  id: string
  user: {
    id: string
    fullName?: string | null // matches useWorkspaceMembers GQL type
    email: string
    avatarUrl?: string | null
  }
}

interface AddPageCollaboratorsFormProps {
  pageId: string
  availableMembers: Array<WorkspaceMember>
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * Form for adding collaborators to a page.
 *
 * Multi-select scrollable member checklist with `Check` icon on selection.
 * Dynamic ScrollArea height: ≤3 auto-fit, ≤6 h-[370px], 7+ h-[440px].
 * Mirrors whiteboard `add-collaborators/ui/add-collaborators-form.tsx` 1:1.
 *
 * @layer Features
 * @module pages/add-page-collaborators
 */
export function AddPageCollaboratorsForm({
  pageId,
  availableMembers,
  onSuccess,
  onCancel,
}: AddPageCollaboratorsFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: addCollaborators, isPending } = useAddPageCollaborators()

  const form = useForm({
    defaultValues: {
      userIds: [] as Array<string>,
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        const collaborators = value.userIds.map((userId) => ({
          userId,
          role: 'EDITOR' as PageRole,
        }))
        await addCollaborators({ pageId, collaborators })
        toast.success(`Added ${value.userIds.length} collaborator(s)`)
        form.reset()
        onSuccess?.()
      } catch (error: unknown) {
        const message = mapAddPageCollaboratorsError(error)
        setRootError(message)
        toast.error(message)
      }
    },
  })

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

  const getScrollAreaHeight = (count: number): string => {
    if (count === 0) return 'h-[100px]'
    if (count <= 3) return 'h-auto max-h-[222px]'
    if (count <= 6) return 'h-[370px]'
    return 'h-[440px]'
  }

  return (
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

      <form.Field name="userIds">
        {(field) => (
          <div className="space-y-2">
            <ScrollArea
              className={cn(
                getScrollAreaHeight(availableMembers.length),
                'rounded-md border p-4',
              )}
            >
              <div className="space-y-2">
                {availableMembers.map((member) => {
                  const isSelected = field.state.value.includes(member.user.id)
                  return (
                    <button
                      key={member.user.id}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? field.state.value.filter(
                              (id) => id !== member.user.id,
                            )
                          : [...field.state.value, member.user.id]
                        field.handleChange(next)
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent',
                        isSelected && 'bg-accent',
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.user.avatarUrl || ''} />
                        <AvatarFallback>
                          {getInitials(member.user.fullName ?? 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col items-start">
                        <span className="text-sm font-medium">
                          {member.user.fullName ?? 'Unknown'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member.user.email}
                        </span>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
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
          onClick={onCancel}
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
  )
}

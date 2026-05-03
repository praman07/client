import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { useAddCollaborators } from '../hooks'
import { addCollaboratorsSchema } from '../model'
import { mapAddCollaboratorsError } from '../lib'
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
    fullName: string
    email: string
    avatarUrl: string | null
  }
}

interface AddCollaboratorsFormProps {
  boardId: string
  availableMembers: Array<WorkspaceMember>
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * Form for adding collaborators to a whiteboard board
 *
 * Features: Multi-select member list, TanStack Form, Zod validation
 */
export function AddCollaboratorsForm({
  boardId,
  availableMembers,
  onSuccess,
  onCancel,
}: AddCollaboratorsFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)
  const { mutateAsync: addCollaborators, isPending } = useAddCollaborators()

  const form = useForm({
    defaultValues: {
      boardId,
      userIds: [] as Array<string>,
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        const result = await addCollaborators(value)
        const { addedCount } = result.addBoardCollaborators
        toast.success(`Added ${addedCount} collaborator(s)`)
        form.reset()
        onSuccess?.()
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

  /**
   * Calculate ScrollArea height based on number of available members
   * - 1-3 members: Auto-fit (no scroll, compact)
   * - 4-6 members: Semi-scrollable (370px, shows ~5 items)
   * - 7+ members: Full scrollable (440px, shows ~6 items)
   */
  const getScrollAreaHeight = (memberCount: number): string => {
    if (memberCount === 0) return 'h-[100px]' // Edge case
    if (memberCount <= 3) return 'h-auto max-h-[222px]' // Auto-fit, no scroll
    if (memberCount <= 6) return 'h-[370px]' // Semi-scrollable
    return 'h-[440px]' // Full scrollable
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
        <div className="rounded-md bg-danger-subtle p-3 text-14 text-danger-primary">
          {rootError}
        </div>
      )}

      <form.Field
        name="userIds"
        validators={{
          onChange: ({ value }) => {
            const result = addCollaboratorsSchema.shape.userIds.safeParse(value)
            if (!result.success) return result.error.issues[0].message
            return undefined
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <ScrollArea
              className={cn(
                getScrollAreaHeight(availableMembers.length),
                'rounded-md border border-subtle p-4',
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
                        const newValue = isSelected
                          ? field.state.value.filter(
                              (id) => id !== member.user.id,
                            )
                          : [...field.state.value, member.user.id]
                        field.handleChange(newValue)
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-layer-2',
                        isSelected && 'bg-accent-subtle',
                      )}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.user.avatarUrl || ''} />
                        <AvatarFallback>
                          {getInitials(member.user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col items-start">
                        <span className="text-14 font-medium">
                          {member.user.fullName}
                        </span>
                        <span className="text-12 text-secondary">
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
              <p className="text-14 text-danger-primary">
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

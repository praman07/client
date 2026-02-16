import { useBoard } from '@/features/whiteboard/fetch-board'
import { useRenameBoard } from '@/features/whiteboard/rename-board/hooks'
import { useUpdateDescription } from '@/features/whiteboard/update-description/hooks'
import { Input } from '@/shared/ui/primitives/input'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { Button } from '@/shared/ui/primitives/button'
import { Label } from '@/shared/ui/primitives/label'
import { useSettingsForm } from '../hooks/use-settings-form'
import { useEffect } from 'react'

interface GeneralTabProps {
  boardId: string
}

/**
 * General settings tab
 *
 * Edit board name and description
 */
export function GeneralTab({ boardId }: GeneralTabProps) {
  const { data: board } = useBoard(boardId)
  const renameBoard = useRenameBoard()
  const updateDescription = useUpdateDescription()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useSettingsForm({
    defaultName: board?.getBoard?.title,
    defaultDescription: board?.getBoard?.description || '',
  })

  // Reset form when board data loads
  useEffect(() => {
    if (board?.getBoard) {
      reset({
        name: board.getBoard.title,
        description: board.getBoard.description || '',
      })
    }
  }, [board, reset])

  const onSubmit = async (data: { name: string; description: string }) => {
    const promises = []

    // Only update if changed
    if (data.name !== board?.getBoard?.title) {
      promises.push(renameBoard.mutateAsync({ boardId, title: data.name }))
    }

    if (data.description !== board?.getBoard?.description) {
      promises.push(
        updateDescription.mutateAsync({
          boardId,
          description: data.description,
        }),
      )
    }

    await Promise.all(promises)
  }

  const isPending = renameBoard.isPending || updateDescription.isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Board Name</Label>
        <Input
          id="name"
          {...register('name', { required: true })}
          placeholder="Enter board name..."
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          The name will be visible to all collaborators
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Add a description for this board..."
          rows={4}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Optional description to help others understand the board's purpose
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

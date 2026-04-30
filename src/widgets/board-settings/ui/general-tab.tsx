import { useEffect } from 'react'
import { useSettingsForm } from '../hooks/use-settings-form'
import { useBoard } from '@/features/whiteboard/fetch-board'
import { useRenameBoard } from '@/features/whiteboard/rename-board'
import { useUpdateDescription } from '@/features/whiteboard/update-description'
import { Input } from '@/shared/ui/primitives/input'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { Button } from '@/shared/ui/primitives/button'
import { Label } from '@/shared/ui/primitives/label'

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
  const form = useSettingsForm({
    defaultName: board?.getBoard?.title,
    defaultDescription: board?.getBoard?.description || '',
  })

  // Reset form when board data loads
  useEffect(() => {
    if (board?.getBoard) {
      form.reset({
        name: board.getBoard.title,
        description: board.getBoard.description || '',
      })
    }
  }, [board, form])

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
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit(onSubmit)
      }}
      className="space-y-6"
    >
      <form.Field
        name="name"
        children={(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Board Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter board name..."
                disabled={isPending}
              />
              <p className="text-12 text-secondary">
                The name will be visible to all collaborators
              </p>
            </div>
          )
        }}
      />

      <form.Field
        name="description"
        children={(field) => {
          return (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Description</Label>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Add a description for this board..."
                rows={4}
                disabled={isPending}
              />
              <p className="text-12 text-secondary">
                Optional description to help others understand the board's
                purpose
              </p>
            </div>
          )
        }}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

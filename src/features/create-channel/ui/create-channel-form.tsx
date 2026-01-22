import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import { useAppSelector } from '@/shared/hooks'
import { selectCurrentWorkspace } from '@/entities/workspace/model/selectors'

import { createChannelSchema } from '../model/schema'
import type { CreateChannelFormValues } from '../model/types'
import { useCreateChannel } from '../hooks/use-create-channel'

interface Props {
  onClose: () => void
}

export function CreateChannelForm({ onClose }: Props) {
  const currentWorkspace = useAppSelector(selectCurrentWorkspace)
  const { mutate, isPending } = useCreateChannel()
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      name: '',
      topic: '',
      type: 'PUBLIC',
    } as CreateChannelFormValues,
    validators: {
      onChange: createChannelSchema,
    },
    onSubmit: async ({ value }) => {
      if (!currentWorkspace?.id) return

      mutate(
        {
          workspaceId: currentWorkspace.id,
          name: value.name,
          topic: value.topic,
          type: value.type,
        },
        {
          onSuccess: () => {
            setIsSuccess(true)
            toast.success('Channel created successfully')
            onClose()
          },
          onError: (error) => {
            toast.error('Failed to create channel')
            console.error(error)
          },
        },
      )
    },
  })

  // We can show a success view if needed, but for now we close on success or show toast.
  // Implementing immediate close on success as per standard modal UX.

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4 pt-2"
    >
      <form.Field
        name="name"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Channel Name</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">
                #
              </span>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="e.g. implementation-plan"
                className="pl-7"
              />
            </div>
            {field.state.meta.errors ? (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Lowercase, numbers, and dashes only.
            </p>
          </div>
        )}
      />

      <form.Field
        name="type"
        children={(field) => (
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select
              value={field.state.value}
              onValueChange={(val: 'PUBLIC' | 'PRIVATE') =>
                field.handleChange(val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">
                  Public - Anyone in workspace
                </SelectItem>
                <SelectItem value="PRIVATE">Private - Invite only</SelectItem>
              </SelectContent>
            </Select>
            {field.state.meta.errors ? (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            ) : null}
          </div>
        )}
      />

      <form.Field
        name="topic"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Topic (Optional)</Label>
            <Input
              id={field.name}
              value={field.state.value ?? ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="What is this channel about?"
            />
            {field.state.meta.errors ? (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(', ')}
              </p>
            ) : null}
          </div>
        )}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isPending || isSubmitting}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Channel
            </Button>
          )}
        />
      </div>
    </form>
  )
}

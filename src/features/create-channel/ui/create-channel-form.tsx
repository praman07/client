import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useCreateChannel } from '../hooks'
import { getChannelErrorMessage } from '../lib'
import { ChannelNameField } from './channel-name-field'
import { ChannelTopicField } from './channel-topic-field'
// import { ChannelTypeField } from './channel-type-field'
import type { CreateChannelFormApi } from '../model'
import { Button } from '@/shared/ui'

interface CreateChannelFormProps {
  workspaceId: string
  projectId: string
  onSuccess: () => void
}

export function CreateChannelForm({
  workspaceId,
  projectId,
  onSuccess,
}: CreateChannelFormProps) {
  const [rootError, setRootError] = useState<string | null>(null)

  const { mutateAsync: createChannel, isPending: isCreating } =
    useCreateChannel()

  const form = useForm({
    defaultValues: {
      name: '',
      topic: '',
      type: 'CHANNEL' as const,
    },
    onSubmit: async ({ value }) => {
      setRootError(null)
      try {
        await createChannel({
          workspaceId,
          projectId,
          name: value.name,
          topic: value.topic || undefined,
          type: value.type as any,
          memberUserIds: [],
        })
        toast.success('Channel created!')
        onSuccess()
      } catch (error) {
        const response = getChannelErrorMessage(error)
        const msg = response.description
        setRootError(msg)
        // Toast fallback for generic errors
        if (!msg.includes('taken')) {
          toast.error(msg)
        }
      }
    },
  }) as CreateChannelFormApi

  return (
    <div className="space-y-8">
      {rootError && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
          {rootError}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-8"
      >
        <ChannelNameField form={form} projectId={projectId} />
        <ChannelTopicField form={form} />

        <div className="flex justify-end pt-2">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit]) => (
              <Button type="submit" disabled={!canSubmit || isCreating}>
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Channel
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  )
}

import { createChannelSchema  } from '../model'
import type { ChannelFormApi  } from '../model';
import { Label, Textarea } from '@/shared/ui'

interface Props {
  form: ChannelFormApi
}

export function ChannelTopicField({ form }: Props) {
  return (
    <form.Field
      name="topic"
      validators={{
        onChange: ({ value }) => {
          const result = createChannelSchema.shape.topic.safeParse(value)
          if (!result.success) return result.error.issues[0].message
          return undefined
        },
      }}
    >
      {(field) => {
        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Enter') {
            const textarea = e.currentTarget
            const value = textarea.value
            const lines = value.split('\n')

            // Count consecutive empty lines at cursor position
            const cursorPos = textarea.selectionStart
            let lineStart = 0
            let currentLine = 0

            for (let i = 0; i < lines.length; i++) {
              const lineEnd = lineStart + lines[i].length + 1 // +1 for \n
              if (cursorPos >= lineStart && cursorPos <= lineEnd) {
                currentLine = i
                break
              }
              lineStart = lineEnd
            }

            // Count empty lines before current line
            let consecutiveEmpty = 0
            for (let i = currentLine; i >= 0; i--) {
              if (lines[i].trim() === '') {
                consecutiveEmpty++
              } else {
                break
              }
            }

            // Prevent more than 1 consecutive empty line
            if (consecutiveEmpty >= 1) {
              e.preventDefault()
            }
          }
        }

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          let value = e.target.value

          // Limit to max 2 co  nsecutive empty lines and reasonable total length
          const lines = value.split('\n')
          const cleanedLines = []
          let consecutiveEmpty = 0

          for (const line of lines) {
            if (line.trim() === '') {
              consecutiveEmpty++
              if (consecutiveEmpty <= 2) {
                cleanedLines.push(line)
              }
            } else {
              consecutiveEmpty = 0
              cleanedLines.push(line)
            }
          }

          value = cleanedLines.join('\n')

          // Ensure total content doesn't exceed reasonable length for topic
          if (value.length <= 1000) {
            field.handleChange(value)
          }
        }

        return (
          <div className="space-y-3">
            <Label htmlFor={field.name} className="text-base font-medium">
              Topic (Optional)
            </Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value || ''}
              onBlur={field.handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="What's this channel about?"
              className="max-h-[120px] resize-none overflow-hidden"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive font-medium">
                {field.state.meta.errors.join(', ')}
              </p>
            )}
          </div>
        )
      }}
    </form.Field>
  )
}

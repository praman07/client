import { CHANNEL_TYPES } from '../model'
import type { ChannelFormApi, ChannelType } from '../model'
import { Label, RadioGroup, RadioGroupItem } from '@/shared/ui'

interface Props {
  form: ChannelFormApi
}

export function ChannelTypeField({ form }: Props) {
  return (
    <form.Field name="type">
      {(field) => (
        <div className="space-y-3">
          <Label className="text-base font-medium">Visibility</Label>
          <RadioGroup
            value={field.state.value}
            onValueChange={(val) => field.handleChange(val as ChannelType)}
            className="flex flex-col space-y-2"
          >
            {CHANNEL_TYPES.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={type} />
                <Label htmlFor={type} className="capitalize">
                  {type.toLowerCase()}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </form.Field>
  )
}

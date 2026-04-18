import type { WorkspaceFormApi } from '../model'
import { Label, RadioGroup, RadioGroupItem } from '@/shared/ui'

interface Props {
  form: WorkspaceFormApi
}

const TEAM_SIZES = ['just_me', '1-10', '10-50', '50+'] as const

export function TeamSizeField({ form }: Props) {
  return (
    <form.Field name="teamSize">
      {(field) => (
        <div className="space-y-3">
          <Label className="text-14 font-medium">Team Size</Label>
          <RadioGroup
            value={field.state.value}
            onValueChange={(val) => field.handleChange(val)}
            className="grid grid-cols-4 gap-3"
          >
            {TEAM_SIZES.map((size) => {
              const isSelected = field.state.value === size
              return (
                <div key={size}>
                  <RadioGroupItem
                    value={size}
                    id={size}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={size}
                    className={`
                      flex h-12 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-all
                      ${
                        isSelected
                          ? 'border-subtle bg-accent-primary text-on-color'
                          : 'border-subtle-1 bg-layer-1 hover:bg-layer-1-hover'
                      }
                    `}
                  >
                    {size === 'just_me' ? 'Just me' : size}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>
      )}
    </form.Field>
  )
}

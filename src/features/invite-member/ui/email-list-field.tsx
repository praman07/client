import { Plus, Trash2 } from 'lucide-react'
import type { InviteMemberFormApi } from '../model'
import { Button, Input , Label  } from '@/shared/ui'

interface Props {
  form: InviteMemberFormApi
}

export function EmailListField({ form }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Email Addresses</Label>

      <form.Field name="emails" mode="array">
        {(field) => {
          const emails = field.state.value as Array<{ email: string }>
          const lastEmail = emails[emails.length - 1]?.email
          // Disable add button if last email is empty
          const canAddMore = !!lastEmail && emails.length < 10

          return (
            <>
              {emails.map((_, i) => (
                <form.Field key={i} name={`emails[${i}].email`}>
                  {(subField) => (
                    <div className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <Input
                          placeholder="user@example.com"
                          name={subField.name}
                          value={subField.state.value}
                          onBlur={subField.handleBlur}
                          onChange={(e) =>
                            subField.handleChange(e.target.value)
                          }
                        />
                        {subField.state.meta.errors.length > 0 && (
                          <p className="text-sm font-medium text-destructive">
                            {subField.state.meta.errors
                              .map((e: any) => e?.message || e)
                              .join(', ')}
                          </p>
                        )}
                      </div>

                      {emails.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-0.5"
                          onClick={() => field.removeValue(i)}
                          title="Remove email"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  )}
                </form.Field>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2"
                disabled={!canAddMore}
                onClick={() => field.pushValue({ email: '' })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add another
              </Button>
            </>
          )
        }}
      </form.Field>
    </div>
  )
}

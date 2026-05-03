import { Plus, Trash2 } from 'lucide-react'
import { hasDuplicateEmail, validateSingleEmail } from '../hooks'
import type { InviteMemberFormApi } from '../model'
import { Button, Input, Label } from '@/shared/ui'

interface Props {
  form: InviteMemberFormApi
  existingMemberEmails: Array<string>
}

export function EmailListField({ form, existingMemberEmails }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Email Addresses</Label>

      <form.Field name="emails" mode="array">
        {(field) => {
          const emails = field.state.value as Array<{ email: string }>
          const allEmailStrings = emails.map((e) => e.email)

          return (
            <>
              {emails.map((_, i) => (
                <form.Field key={i} name={`emails[${i}].email`}>
                  {(subField) => {
                    const email = subField.state.value || ''

                    // Get member validation error if any
                    const memberError =
                      existingMemberEmails.length > 0
                        ? validateSingleEmail(email, existingMemberEmails)
                        : undefined

                    // Check for duplicate (excluding current field)
                    const otherEmails = allEmailStrings.filter(
                      (_email, idx) => idx !== i
                    )
                    const isDuplicate =
                      hasDuplicateEmail(email, otherEmails) &&
                      email.length > 0
                    const duplicateError = isDuplicate
                      ? 'This email was already added'
                      : undefined

                    const displayError = duplicateError || memberError

                    return (
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
                          {displayError && (
                            <p className="text-13 font-medium text-danger-primary">
                              {displayError}
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
                            <Trash2 className="h-4 w-4 text-secondary" />
                          </Button>
                        )}
                      </div>
                    )
                  }}
                </form.Field>
              ))}

              {/* form.Subscribe so canAddMore reacts to typed values, not just push/remove */}
              <form.Subscribe
                selector={(state) =>
                  (state.values.emails as Array<{ email: string }>)
                }
              >
                {(liveEmails) => {
                  const lastEmail = liveEmails[liveEmails.length - 1]?.email ?? ''
                  const canAddMore =
                    lastEmail.trim().length > 0 &&
                    lastEmail.includes('@') &&
                    liveEmails.length < 10
                  return (
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
                  )
                }}
              </form.Subscribe>
            </>
          )
        }}
      </form.Field>

    </div>
  )
}

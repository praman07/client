'use client'

import * as React from 'react'
import type * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/shared/lib/utils'
import { Label } from '@/shared/ui/primitives/label'

// FormItem — provides ID context for label/input association
const FormItemContext = React.createContext<{ id: string }>(
  {} as { id: string },
)

function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-1.5', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

// FormLabel — label for a form field, associates with input via htmlFor
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <Label
      data-slot="form-label"
      className={cn(className)}
      htmlFor={props.htmlFor}
      {...props}
    />
  )
}

// FormDescription — helper text below a field
function FormDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="form-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

// FormMessage — displays validation error or custom message
function FormMessage({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="form-message"
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    />
  )
}

export { FormItem, FormLabel, FormDescription, FormMessage }

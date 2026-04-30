import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'

import { HugeiconsIcon } from '@hugeicons/react'
import { MinusSignIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/shared/lib/utils'

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        'cn-input-otp flex items-center has-disabled:opacity-50',
        containerClassName,
      )}
      spellCheck={false}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        'has-aria-invalid:ring-2 has-aria-invalid:ring-danger-strong/20 has-aria-invalid:border-danger-strong rounded-md flex items-center',
        className,
      )}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'bg-layer-1 border-subtle-1 data-[active=true]:border-accent-strong data-[active=true]:ring-2 data-[active=true]:ring-accent-strong/20 aria-invalid:border-danger-strong size-9 border-y border-r text-13 transition-colors duration-100 outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 relative flex items-center justify-center',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-accent-primary h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-separator"
      className="[&_svg:not([class*='size-'])]:size-4 flex items-center text-subtle"
      role="separator"
      {...props}
    >
      <HugeiconsIcon icon={MinusSignIcon} strokeWidth={2} />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

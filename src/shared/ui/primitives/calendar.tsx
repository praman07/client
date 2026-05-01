'use client'

import * as React from 'react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'

import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { DayButton } from 'react-day-picker'
import { cn } from '@/shared/lib/utils'
import { Button, buttonVariants } from '@/shared/ui/primitives'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
  orientation?: 'horizontal' | 'vertical' | 'up' | 'down' | 'left' | 'right'
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)] bg-surface-1 group/calendar in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'flex gap-4 flex-col md:flex-row relative',
          defaultClassNames.months,
        ),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none hardware-accelerated active:scale-[0.95] transition-all duration-(--transition-expressive)',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none hardware-accelerated active:scale-[0.95] transition-all duration-(--transition-expressive)',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          'relative cn-calendar-dropdown-root rounded-(--cell-radius)',
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          'absolute bg-surface-2 inset-0 opacity-0',
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : 'cn-calendar-caption-label rounded-(--cell-radius) flex items-center gap-1 text-13 [&>svg]:text-tertiary [&>svg]:size-3.5',
          defaultClassNames.caption_label,
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'text-tertiary rounded-(--cell-radius) flex-1 font-normal text-11 select-none',
          defaultClassNames.weekday,
        ),
        week: cn('flex w-full mt-2', defaultClassNames.week),
        week_number_header: cn(
          'select-none w-(--cell-size)',
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          'text-11 select-none text-tertiary',
          defaultClassNames.week_number,
        ),
        day: cn(
          'relative w-full rounded-(--cell-radius) h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius) group/day aspect-square select-none',
          props.showWeekNumber
            ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)'
            : '[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)',
          defaultClassNames.day,
        ),
        range_start: cn(
          'rounded-l-(--cell-radius) bg-accent-subtle relative after:bg-accent-subtle after:absolute after:inset-y-0 after:w-4 after:right-0 -z-0 isolate',
          defaultClassNames.range_start,
        ),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn(
          'rounded-r-(--cell-radius) bg-accent-subtle relative after:bg-accent-subtle after:absolute after:inset-y-0 after:w-4 after:left-0 -z-0 isolate',
          defaultClassNames.range_end,
        ),
        today: cn(
          'bg-layer-2 text-primary rounded-(--cell-radius) data-[selected=true]:rounded-none',
          defaultClassNames.today,
        ),
        outside: cn(
          'text-tertiary aria-selected:text-tertiary',
          defaultClassNames.outside,
        ),
        disabled: cn(
          'text-tertiary opacity-40',
          defaultClassNames.disabled,
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, ...rootProps }) => {
          return (
            <div
              data-slot="calendar"
              {...rootProps}
              className={cn(rootClassName)}
            />
          )
        },
        Chevron: ({ className: chevronClassName, ...chevronProps }) => {
          if (props.orientation === 'left') {
            return (
              <ChevronLeft className={cn('size-4', chevronClassName)} {...chevronProps} />
            )
          }

          if (props.orientation === 'right') {
            return (
              <ChevronRight className={cn('size-4', chevronClassName)} {...chevronProps} />
            )
          }

          return (
            <ChevronDown className={cn('size-4', chevronClassName)} {...chevronProps} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...weekNumberProps }) => {
          return (
            <td {...weekNumberProps}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'data-[selected-single=true]:bg-accent-primary data-[selected-single=true]:text-on-color data-[range-middle=true]:bg-accent-subtle data-[range-middle=true]:text-primary data-[range-start=true]:bg-accent-primary data-[range-start=true]:text-on-color data-[range-end=true]:bg-accent-primary data-[range-end=true]:text-on-color group-data-[focused=true]/day:border-accent-strong group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-accent-strong/20 relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) [&>span]:text-11 [&>span]:opacity-70 hardware-accelerated active:scale-[0.95] transition-transform duration-100',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

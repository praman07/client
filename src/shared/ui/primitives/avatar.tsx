'use client'

import * as React from 'react'
import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'

import { cn } from '@/shared/lib/utils'

function Avatar({
  className,
  size = 'default',
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl'
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        // Base
        'relative grid shrink-0 place-items-center select-none rounded-full overflow-hidden',
        // Sizes
        'data-[size=xs]:size-5',
        'data-[size=sm]:size-6',
        'data-[size=default]:size-8',
        'data-[size=lg]:size-10',
        'data-[size=xl]:size-12',
        // Ring overlay for contrast
        'after:absolute after:inset-0 after:rounded-full after:border after:border-subtle after:mix-blend-darken',
        'group/avatar',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  // Prevent browser layout jank from rendering an <img> with an empty src
  if (!props.src) return null

  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        'rounded-full aspect-square size-full object-cover col-start-1 row-start-1',
        className,
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        // Background
        'bg-layer-2 text-secondary rounded-full',
        // Layout
        'flex size-full items-center justify-center col-start-1 row-start-1',
        // Typography — scales with parent size
        'text-11 font-semibold leading-none',
        'group-data-[size=lg]/avatar:text-13 group-data-[size=xl]/avatar:text-14',
        'group-data-[size=xs]/avatar:text-10 group-data-[size=sm]/avatar:text-10',
        className,
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        // Positioning
        'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full select-none',
        // Ring separator using canvas bg
        'ring-2 ring-canvas',
        // Sizes by parent avatar size
        'group-data-[size=xs]/avatar:size-1.5 group-data-[size=xs]/avatar:[&>svg]:hidden',
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
        'group-data-[size=xl]/avatar:size-3.5 group-data-[size=xl]/avatar:[&>svg]:size-2.5',
        className,
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        'flex -space-x-2 group/avatar-group',
        '*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-canvas',
        className,
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        // Match avatar size within group
        'bg-layer-2 text-secondary',
        'size-8 rounded-full text-12 font-semibold',
        'group-has-data-[size=lg]/avatar-group:size-10',
        'group-has-data-[size=sm]/avatar-group:size-6',
        // Icon sizes
        '[&>svg]:size-4',
        'group-has-data-[size=lg]/avatar-group:[&>svg]:size-5',
        'group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
        // Ring
        'ring-2 ring-canvas relative flex shrink-0 items-center justify-center select-none',
        className,
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}

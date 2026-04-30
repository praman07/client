'use client'

import * as React from 'react'
import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'

import { cn } from '@/shared/lib/utils'

function Avatar({
  className,
  size = 'default',
  shape = 'circle',
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl'
  shape?: 'circle' | 'square' | 'rounded'
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      data-shape={shape}
      className={cn(
        // Base
        'relative grid shrink-0 place-items-center select-none overflow-hidden',
        // Shape
        'data-[shape=circle]:rounded-full',
        'data-[shape=square]:rounded-xl',
        'data-[shape=rounded]:rounded-lg',
        // Sizes
        'data-[size=xs]:size-5',
        'data-[size=sm]:size-6',
        'data-[size=default]:size-8',
        'data-[size=lg]:size-10',
        'data-[size=xl]:size-12',
        'data-[size=2xl]:size-16',
        'data-[size=3xl]:size-24',
        // Ring overlay for contrast
        'after:absolute after:inset-0 after:border after:border-subtle after:mix-blend-darken',
        'data-[shape=circle]:after:rounded-full',
        'data-[shape=square]:after:rounded-xl',
        'data-[shape=rounded]:after:rounded-lg',
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
        'aspect-square size-full object-cover col-start-1 row-start-1',
        'data-[shape=circle]:rounded-full',
        'data-[shape=square]:rounded-xl',
        'data-[shape=rounded]:rounded-lg',
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
        'bg-layer-2 text-secondary',
        // Layout
        'flex size-full items-center justify-center col-start-1 row-start-1',
        // Shape
        'data-[shape=circle]:rounded-full',
        'data-[shape=square]:rounded-xl',
        'data-[shape=rounded]:rounded-lg',
        // Typography — scales with parent size
        'text-11 font-semibold leading-none',
        'group-data-[size=lg]/avatar:text-13 group-data-[size=xl]/avatar:text-14',
        'group-data-[size=2xl]/avatar:text-18 group-data-[size=3xl]/avatar:text-24',
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
        'absolute right-0 bottom-0 z-10 inline-flex items-center justify-center select-none',
        // Shape follows parent
        'data-[shape=circle]:rounded-full',
        'data-[shape=square]:rounded-xl',
        'data-[shape=rounded]:rounded-lg',
        // Ring separator using canvas bg
        'ring-2 ring-canvas',
        // Sizes by parent avatar size
        'group-data-[size=xs]/avatar:size-1.5 group-data-[size=xs]/avatar:[&>svg]:hidden',
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
        'group-data-[size=xl]/avatar:size-3.5 group-data-[size=xl]/avatar:[&>svg]:size-2.5',
        'group-data-[size=2xl]/avatar:size-4 group-data-[size=2xl]/avatar:[&>svg]:size-3',
        'group-data-[size=3xl]/avatar:size-5 group-data-[size=3xl]/avatar:[&>svg]:size-4',
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
        // Optional border for avatar group separation (instead of hardcoded canvas ring)
        '*:data-[slot=avatar]:border-2 *:data-[slot=avatar]:border-layer-1',
        // Shape support for group
        '*:data-[shape=circle]:rounded-full',
        '*:data-[shape=square]:rounded-xl',
        '*:data-[shape=rounded]:rounded-lg',
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
        'size-8 text-12 font-semibold',
        'group-has-data-[size=lg]/avatar-group:size-10',
        'group-has-data-[size=sm]/avatar-group:size-6',
        'group-has-data-[size=xl]/avatar-group:size-12',
        'group-has-data-[size=2xl]/avatar-group:size-16',
        'group-has-data-[size=3xl]/avatar-group:size-24',
        // Shape
        'data-[shape=circle]:rounded-full',
        'data-[shape=square]:rounded-xl',
        'data-[shape=rounded]:rounded-lg',
        // Icon sizes
        '[&>svg]:size-4',
        'group-has-data-[size=lg]/avatar-group:[&>svg]:size-5',
        'group-has-data-[size=sm]/avatar-group:[&>svg]:size-3',
        // Border instead of canvas ring
        'border-2 border-layer-1 relative flex shrink-0 items-center justify-center select-none',
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

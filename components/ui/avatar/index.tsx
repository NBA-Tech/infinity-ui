'use client';
import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { cssInterop } from 'nativewind';
import { useStyleContext, withStyleContext } from '@gluestack-ui/nativewind-utils/withStyleContext';
import type { VariantProps } from '@gluestack-ui/nativewind-utils';

const SCOPE = 'AVATAR';

/* --------------------------------------------
   REGISTER NATIVE COMPONENTS
--------------------------------------------- */
cssInterop(View, { className: { target: 'style' } });
cssInterop(Text, { className: { target: 'style' } });
cssInterop(Image, { className: { target: 'style' } });

/* --------------------------------------------
   ROOT COMPONENT (NO WITHSTYLECONTEXT)
--------------------------------------------- */
const Root = View;

/* --------------------------------------------
   COMPONENT MAP (manual createAvatar replacement)
--------------------------------------------- */
const UIAvatar = {
  Root,
  Badge: View,
  Group: View,
  Image: Image,
  FallbackText: Text,
};

/* --------------------------------------------
   STYLES (EXACT same as your previous setup)
--------------------------------------------- */

const avatarStyle = tva({
  base: 'rounded-full justify-center items-center relative bg-primary-600 group-[.avatar-group]/avatar-group:-ml-2.5',
  variants: {
    size: {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
      '2xl': 'w-32 h-32',
    },
  },
});

const avatarFallbackTextStyle = tva({
  base: 'text-typography-0 font-semibold uppercase overflow-hidden',
  parentVariants: {
    size: {
      xs: 'text-2xs',
      sm: 'text-xs',
      md: 'text-base',
      lg: 'text-xl',
      xl: 'text-3xl',
      '2xl': 'text-5xl',
    },
  },
});

const avatarGroupStyle = tva({
  base: 'flex-row-reverse relative avatar-group group/avatar-group',
});

const avatarBadgeStyle = tva({
  base: 'bg-success-500 rounded-full absolute right-0 bottom-0 border-background-0 border-2',
  parentVariants: {
    size: {
      xs: 'w-2 h-2',
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
      xl: 'w-6 h-6',
      '2xl': 'w-8 h-8',
    },
  },
});

const avatarImageStyle = tva({
  base: 'h-full w-full rounded-full absolute',
});

/* --------------------------------------------
   AVATAR MAIN COMPONENT
--------------------------------------------- */

type IAvatarProps = VariantProps<typeof avatarStyle> &
  Omit<React.ComponentPropsWithoutRef<typeof UIAvatar.Root>, 'context'>;

const Avatar = React.forwardRef<any, IAvatarProps>(function Avatar(
  { className, size = 'md', ...props },
  ref
) {
  return (
    <UIAvatar.Root
      ref={ref}
      {...props}
      className={avatarStyle({ size, class: className })}
    />
  );
});

/* --------------------------------------------
   BADGE (reads size from parent)
--------------------------------------------- */

const AvatarBadge = React.forwardRef<any, any>(function AvatarBadge(
  { className, size, ...props },
  ref
) {
  const parent = useStyleContext(SCOPE) ?? { size };

  return (
    <UIAvatar.Badge
      ref={ref}
      {...props}
      className={avatarBadgeStyle({
        parentVariants: { size: parent.size },
        class: className,
      })}
    />
  );
});

/* --------------------------------------------
   FALLBACK TEXT
--------------------------------------------- */

const AvatarFallbackText = React.forwardRef<any, any>(
  function AvatarFallbackText({ className, children, ...props }, ref) {
    const parent = useStyleContext(SCOPE) ?? { size: 'md' };

    const getInitials = (value: string) => {
      if (!value) return '';
      return value
        .trim()
        .split(/\s+/)
        .map((word) => word[0].toUpperCase())
        .join('')
        .slice(0, 3); // max 3 chars
    };

    const initials =
      typeof children === 'string' ? getInitials(children) : children;

    return (
      <UIAvatar.FallbackText
        ref={ref}
        {...props}
        className={avatarFallbackTextStyle({
          parentVariants: { size: parent.size },
          class: className,
        })}
      >
        {initials}
      </UIAvatar.FallbackText>
    );
  }
);


/* --------------------------------------------
   IMAGE (supports web fix)
--------------------------------------------- */

const AvatarImage = React.forwardRef<any, any>(function AvatarImage(
  { className, ...props },
  ref
) {
  return (
    <UIAvatar.Image
      ref={ref}
      {...props}
      className={avatarImageStyle({ class: className })}
      style={
        Platform.OS === 'web'
          ? { height: 'revert-layer', width: 'revert-layer' }
          : undefined
      }
    />
  );
});

/* --------------------------------------------
   GROUP
--------------------------------------------- */

const AvatarGroup = React.forwardRef<any, any>(function AvatarGroup(
  { className, ...props },
  ref
) {
  return (
    <UIAvatar.Group
      ref={ref}
      {...props}
      className={avatarGroupStyle({ class: className })}
    />
  );
});

/* --------------------------------------------
   EXPORT
--------------------------------------------- */

Avatar.displayName = 'Avatar';
AvatarBadge.displayName = 'AvatarBadge';
AvatarFallbackText.displayName = 'AvatarFallbackText';
AvatarImage.displayName = 'AvatarImage';
AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage, AvatarGroup };
